"use client";

import React, { useState, useEffect, useCallback } from 'react';
import AdInput from './AdInput';
import { LogoutButton } from '@/components/auth/auth-buttons';
import { useSession } from 'next-auth/react';

interface FormData {
  brandName: string;
  product: string;
  userBenefit: string;
  promotion: string;
  audience: string;
  goal: string;
  keywords: string;
  additionalRules: string;
}

interface AdData {
  headline: string;
  primaryText: string;
  liked: boolean;
}

interface LikedHeadline {
  id: string;
  headline: string;
  primaryText: string;
  timestamp: string;
  userId: string;
}

const AdMaker: React.FC = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<FormData>({
    brandName: '',
    product: '',
    userBenefit: '',
    promotion: '',
    audience: '',
    goal: '',
    keywords: '',
    additionalRules: '',
  });
  const [adPreviews, setAdPreviews] = useState<AdData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [likedHeadlines, setLikedHeadlines] = useState<LikedHeadline[]>([]);
  const [showLikedHeadlines, setShowLikedHeadlines] = useState(false);
  const [useLikedHeadlines, setUseLikedHeadlines] = useState(false);

  useEffect(() => {
    const isValid = Object.values(formData).some(value => value.trim() !== '') || csvData !== '';
    setIsFormValid(isValid);
  }, [formData, csvData]);

  useEffect(() => {
    fetchLikedHeadlines();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const cleanCsvData = (data: string): string => {
    // Remove any non-printable characters and unusual symbols
    return data.replace(/[^\x20-\x7E\n]/g, '')
      // Replace multiple spaces with a single space
      .replace(/\s+/g, ' ')
      // Trim whitespace from the beginning and end of each line
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      // Remove empty lines
      .replace(/^\s*[\r\n]/gm, '');
  };

  const handleCsvUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawData = event.target?.result as string;
        const cleanedData = cleanCsvData(rawData);
        
        // Check if the cleaned data is empty
        if (cleanedData.trim() === '') {
          throw new Error('The CSV file is empty or contains only invalid characters.');
        }

        setCsvData(cleanedData);
        setCsvFileName(file.name);
        setCsvError(null);
      } catch (error) {
        console.error('Error processing CSV:', error);
        setCsvError(`Error processing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setCsvData('');
        setCsvFileName(null);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      setCsvError(`Error reading file: ${error}`);
      setCsvData('');
      setCsvFileName(null);
    };
    reader.readAsText(file);
  };

  const handleWriteAds = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...formData, 
          csvData,
          useLikedHeadlines,
          likedHeadlines: useLikedHeadlines ? likedHeadlines : []
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ads');
      }

      const data = await response.json();
      setAdPreviews(data.ads.map((ad: AdData) => ({ ...ad, liked: false })));
    } catch (error) {
      console.error('Error generating ads:', error);
      setError('Failed to generate ads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLikedHeadlines = async () => {
    try {
      const response = await fetch('/api/liked-headlines');
      if (!response.ok) {
        throw new Error('Failed to fetch liked headlines');
      }
      const data = await response.json();
      
      // Sort headlines by timestamp, newest first
      const sortedHeadlines = data.sort((a: LikedHeadline, b: LikedHeadline) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setLikedHeadlines(sortedHeadlines);
    } catch (error) {
      console.error('Error fetching liked headlines:', error);
      alert('Failed to load liked headlines. Please try again.');
    }
  };

  const saveLikedHeadline = async (headline: string, primaryText: string) => {
    try {
      const response = await fetch('/api/liked-headlines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headline, primaryText }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.duplicate) {
          // If it's a duplicate, don't refresh the list
          console.log('Headline already exists in your saved headlines');
        } else {
          // Only refresh if we added a new headline
          await fetchLikedHeadlines();
        }
      }
    } catch (error) {
      console.error('Error saving liked headline:', error);
    }
  };

  const toggleLike = (index: number) => {
    // Only toggle the UI state, don't save to Firebase yet
    setAdPreviews(prevAds => 
      prevAds.map((ad, i) => {
        if (i === index) {
          return { ...ad, liked: !ad.liked };
        }
        return ad;
      })
    );
  };

  const handleDownload = () => {
    const selectedAds = adPreviews.filter(ad => ad.liked);
    if (selectedAds.length === 0) {
      alert('Please select at least one headline to download.');
      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    let content = `Generated on: ${formattedDate} at ${formattedTime}\n\n`;
    content += "Input Summary:\n";
    Object.entries(formData).forEach(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      content += `${formattedKey}: ${value || 'Not provided'}\n`;
    });
    if (csvFileName) {
      content += `CSV file uploaded: ${csvFileName}\n`;
    } else {
      content += `CSV file: Not uploaded\n`;
    }
    content += "\nSelected Ads:\n\n";

    content += selectedAds.map((ad, index) => 
      `Ad ${index + 1}:\nHeadline: ${ad.headline}\nPrimary Text: ${ad.primaryText}\n\n`
    ).join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected_headlines_${formattedDate.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleUseLikedHeadlines = useCallback(() => {
    setUseLikedHeadlines(prev => !prev);
  }, []);

  const handleSaveLikedHeadlines = async () => {
    const likedAds = adPreviews.filter(ad => ad.liked);
    if (likedAds.length === 0) {
      alert('Please like at least one headline to save.');
      return;
    }

    try {
      let savedCount = 0;
      let duplicateCount = 0;

      // Save each liked headline
      for (const ad of likedAds) {
        const response = await fetch('/api/liked-headlines', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            headline: ad.headline, 
            primaryText: ad.primaryText 
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.duplicate) {
            duplicateCount++;
          } else {
            savedCount++;
          }
        }
      }
      
      // Refresh the liked headlines list
      await fetchLikedHeadlines();
      
      // Show appropriate message
      if (savedCount > 0) {
        alert(`${savedCount} headline${savedCount > 1 ? 's' : ''} saved successfully!${
          duplicateCount > 0 ? `\n${duplicateCount} duplicate${duplicateCount > 1 ? 's' : ''} skipped.` : ''
        }`);
      } else if (duplicateCount > 0) {
        alert(`All ${duplicateCount} headline${duplicateCount > 1 ? 's were' : ' was'} already saved.`);
      }
    } catch (error) {
      console.error('Error saving headlines:', error);
      alert('Failed to save headlines. Please try again.');
    }
  };

  // Add useEffect to fetch headlines when showLikedHeadlines changes
  useEffect(() => {
    if (showLikedHeadlines) {
      fetchLikedHeadlines();
    }
  }, [showLikedHeadlines]);

  const handleDeleteAllHeadlines = async () => {
    if (window.confirm('Are you sure you want to delete all saved headlines? This cannot be undone.')) {
      try {
        const response = await fetch('/api/liked-headlines', {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setLikedHeadlines([]);
          alert('All headlines deleted successfully');
        } else {
          throw new Error('Failed to delete headlines');
        }
      } catch (error) {
        console.error('Error deleting headlines:', error);
        alert('Failed to delete headlines. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-zinc-900 text-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">The Headline Lab</h1>
            {session?.user?.email && (
              <p className="text-sm text-zinc-400">{session.user.email}</p>
            )}
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="flex-grow bg-gray-100 p-4 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">Ad Brief</h2>
            <p className="text-sm text-gray-600 mb-4">
              Here's where you fill me in. The more info you give me the better your headlines will be, I just need you to fill at least one field, BUT if you fill them all in you'll get better results. Oh and if you do upload a .csv of high performing examples, make it a one column file please.
            </p>
            <AdInput
              adData={formData}
              onInputChange={handleInputChange}
              onGenerateAds={handleWriteAds}
              onCsvUpload={handleCsvUpload}
              isLoading={isLoading}
              isFormValid={isFormValid}
              csvFileName={csvFileName}
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {csvError && <p className="text-red-500 mt-2">{csvError}</p>}
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setShowLikedHeadlines(!showLikedHeadlines)}
                className="p-2 bg-gray-500 text-white rounded hover:bg-green-500 transition-colors duration-200"
              >
                {showLikedHeadlines ? 'Hide Liked Headlines' : 'Show Liked Headlines'}
              </button>
              {showLikedHeadlines && (
                <button
                  onClick={handleDeleteAllHeadlines}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                >
                  Delete All Headlines
                </button>
              )}
              <button
                onClick={toggleUseLikedHeadlines}
                className={`p-2 text-white rounded transition-colors duration-200 ${
                  useLikedHeadlines ? 'bg-green-500' : 'bg-gray-500 hover:bg-green-500'
                }`}
              >
                {useLikedHeadlines ? 'Using Liked Headlines' : 'Use Liked Headlines'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              You can use these liked headlines as a basis for style. 
              {useLikedHeadlines && " (Currently being used as reference)"}
            </p>
            {showLikedHeadlines && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Your Liked Headlines to date</h3>
                {likedHeadlines.length === 0 ? (
                  <p className="text-gray-500 mt-2">No liked headlines yet.</p>
                ) : (
                  <ul className="list-disc pl-5">
                    {likedHeadlines.map((headline) => (
                      <li key={headline.id} className="mt-2">
                        <p><strong>Headline:</strong> {headline.headline}</p>
                        <p><strong>Primary Text:</strong> {headline.primaryText}</p>
                        <p><small>Liked on: {new Date(headline.timestamp).toLocaleString()}</small></p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Ad Previews</h2>
            <p>Number of previews: {adPreviews.length}</p>
            <div className="space-y-4">
              {adPreviews.map((ad, index) => (
                <div key={index} className="border p-4 rounded relative">
                  <button
                    onClick={() => toggleLike(index)}
                    className="absolute top-2 right-2 text-2xl"
                  >
                    {ad.liked ? '❤️' : '🤍'}
                  </button>
                  <h3 className="font-semibold">Ad {index + 1}</h3>
                  <p><strong>Headline:</strong> {ad.headline}</p>
                  <p><strong>Primary Text:</strong> {ad.primaryText}</p>
                </div>
              ))}
            </div>
            {adPreviews.length > 0 && (
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={handleDownload}
                  className="p-2 bg-gray-500 text-white rounded hover:bg-green-500 transition-colors duration-200"
                >
                  Download Selected Headlines
                </button>
                <button
                  onClick={handleSaveLikedHeadlines}
                  className="p-2 bg-gray-500 text-white rounded hover:bg-green-500 transition-colors duration-200"
                >
                  Save my liked headlines
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export { AdMaker };
