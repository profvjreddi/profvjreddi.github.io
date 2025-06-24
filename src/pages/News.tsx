import Updates from '../components/Updates';

function News() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">News & Updates</h1>
            <div className="w-24 h-1 bg-[#A51C30]"></div>
            <p className="text-lg text-gray-600 mt-6 max-w-3xl">
              Stay up to date with the latest research developments, publications, awards, and lab activities.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Updates />
        </div>
      </div>
    </div>
  );
}

export default News; 