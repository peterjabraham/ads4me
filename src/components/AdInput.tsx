import React, { useRef } from 'react';

interface AdInputProps {
  adData: {
    brandName: string;
    product: string;
    userBenefit: string;
    promotion: string;
    audience: string;
    goal: string;
    keywords: string;
    additionalRules: string;
  };
  onInputChange: (name: string, value: string) => void;
  onGenerateAds: () => void;
  onCsvUpload: (file: File) => void;
  isLoading: boolean;
  isFormValid: boolean;
  csvFileName: string | null;
}

const AdInput: React.FC<AdInputProps> = ({ adData, onInputChange, onGenerateAds, onCsvUpload, isLoading, isFormValid, csvFileName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onCsvUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Brand Name"
          value={adData.brandName}
          onChange={(e) => onInputChange('brandName', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-gray-400 mt-1">Enter the name of your brand or company</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Product"
          value={adData.product}
          onChange={(e) => onInputChange('product', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-gray-400 mt-1">Specify the product or service you're advertising</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="User Benefit or Use"
          value={adData.userBenefit}
          onChange={(e) => onInputChange('userBenefit', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-gray-400 mt-1">Describe the main benefit or use case for your product/service</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Promotion or Offer"
          value={adData.promotion}
          onChange={(e) => onInputChange('promotion', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-gray-400 mt-1">Include any special promotions, discounts, or offers</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Target Audience Segment"
          value={adData.audience}
          onChange={(e) => onInputChange('audience', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-gray-400 mt-1">Define your target audience (e.g., age group, interests, profession)</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Goal or Objective"
          value={adData.goal}
          onChange={(e) => onInputChange('goal', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-gray-400 mt-1">State the main objective of your ad campaign (e.g., increase sales, brand awareness)</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Core Keywords"
          value={adData.keywords}
          onChange={(e) => onInputChange('keywords', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-gray-400 mt-1">List key terms or phrases relevant to your product/service</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Additional rules and exclusions"
          value={adData.additionalRules}
          onChange={(e) => onInputChange('additionalRules', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-gray-400 mt-1">Specify any additional guidelines, restrictions, or things to avoid in the ads</p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 bg-gray-500 text-white rounded hover:bg-green-500 transition-colors duration-200"
          disabled={isLoading}
        >
          Upload .csv file
        </button>
        {csvFileName && (
          <span className="text-xs text-gray-400">
            Uploaded: {csvFileName}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-1">Upload a CSV file with examples of high-performing ads (optional)</p>

      <button
        onClick={onGenerateAds}
        className={`w-full p-2 ${
          isLoading || !isFormValid
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gray-500 hover:bg-green-500 transition-colors duration-200'
        } text-white rounded`}
        disabled={isLoading || !isFormValid}
      >
        {isLoading ? 'Writing Ads...' : 'Write My Ads'}
      </button>
    </div>
  );
};

export default AdInput;
