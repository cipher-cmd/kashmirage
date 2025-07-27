// This defines the structure of our result data
export interface AnalysisResult {
  name: string;
  location: string;
  description: string;
  funFacts: string[];
  imageUrl: string;
}

interface ResultCardProps {
  result: AnalysisResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden max-w-2xl w-full animate-fade-in border border-white/20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={result.imageUrl}
        alt={result.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-6 text-left">
        <h2 className="text-3xl font-bold text-orange-500">{result.name}</h2>
        <p className="text-md text-gray-300 mb-4">{result.location}</p>
        <p className="text-gray-200 leading-relaxed">{result.description}</p>
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            Did you know?
          </h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {result.funFacts.map((fact, index) => (
              <li key={index}>{fact}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
