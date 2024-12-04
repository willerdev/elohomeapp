// ... (previous imports remain the same)

export const PostAd = () => {
  // ... (previous code remains the same until the form JSX)

  return (
    <div className="pb-20 pt-4 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Post an Ad</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (previous form fields remain the same) */}

        {(formData.priceType === 'fixed' || formData.priceType === 'negotiable') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) {formData.priceType === 'negotiable' && '(Starting Price)'}
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              placeholder={formData.priceType === 'negotiable' ? 'Enter starting price' : 'Enter price'}
              required
              min="0"
            />
          </div>
        )}

        {/* ... (rest of the form remains the same) */}
      </form>
    </div>
  );
};