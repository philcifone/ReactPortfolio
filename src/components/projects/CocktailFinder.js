import React, { useState, useEffect } from 'react';
import { Wine, GlassWater, Search, Loader2 } from 'lucide-react';

const CocktailFinder = () => {
  const [selectedSpirit, setSelectedSpirit] = useState('Vodka');
  const [cocktails, setCocktails] = useState([]);
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const spirits = [
    'Vodka',
    'Gin',
    'Rum',
    'Tequila',
    'Whiskey',
    'Bourbon',
    'Scotch',
    'Rye Whiskey',
    'Irish Whiskey',
    'Brandy',
    'Cognac',
    'Absinthe',
    'Mezcal',
    'Champagne',
    'Port',
    'Vermouth',
    'Kahlua',
    'Triple Sec',
    'Amaretto',
    'Campari'
  ];

  const fetchCocktails = async (spirit) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${spirit}`
      );
      const data = await response.json();
      setCocktails(data.drinks || []);
    } catch (err) {
      setError('Failed to fetch cocktails. Please try again.');
    }
    setLoading(false);
  };

  const fetchCocktailDetails = async (drinkName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`
      );
      const data = await response.json();
      setSelectedCocktail(data.drinks[0]);
    } catch (err) {
      setError('Failed to fetch cocktail details. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCocktails(selectedSpirit);
  }, [selectedSpirit]);

  const getIngredients = (cocktail) => {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push({
          ingredient,
          measure: measure || 'To taste'
        });
      }
    }
    return ingredients;
  };

  return (
    <div className="bg-neutral-800 rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-display text-gray-200 mb-2">
          Cocktail Recipe Finder
        </h3>
        <p className="text-gray-400">Find recipes by selecting your preferred spirit</p>
      </div>

      {/* Spirit Selection Tabs */}
      <div className="flex font-display flex-wrap gap-2 mb-6 max-h-48 overflow-y-auto p-2 bg-neutral-700 rounded-lg">
        {spirits.map((spirit) => (
          <button
            key={spirit}
            onClick={() => {
              setSelectedSpirit(spirit);
              setSelectedCocktail(null);
            }}
            className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2
              ${selectedSpirit === spirit 
                ? 'bg-baby-blue text-white' 
                : 'bg-neutral-600 text-gray-300 hover:bg-neutral-500'}`}
          >
            <Wine size={16} />
            {spirit}
          </button>
        ))}
      </div>

      {error && (
        <div className="text-red-400 text-center mb-4 p-3 bg-neutral-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Cocktail List */}
        <div className="bg-neutral-700 rounded-lg p-4 h-[600px] overflow-y-auto">
          <h4 className="text-lg font-display text-gray-200 mb-4">
            {loading ? 'Loading...' : `${selectedSpirit} Cocktails`}
          </h4>
          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            <div className="space-y-2">
              {cocktails.map((cocktail) => (
                <button
                  key={cocktail.idDrink}
                  onClick={() => fetchCocktailDetails(cocktail.strDrink)}
                  className={`w-full text-left p-3 rounded transition-colors
                    ${selectedCocktail?.idDrink === cocktail.idDrink
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-600 text-gray-200 hover:bg-neutral-500'}`}
                >
                  {cocktail.strDrink}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recipe Details */}
        <div className="bg-neutral-700 rounded-lg p-4 h-[600px] overflow-y-auto">
          {selectedCocktail ? (
            <div className="space-y-4">
              <h4 className="text-xl font-display text-gray-200">
                {selectedCocktail.strDrink}
              </h4>
              
              <div className="flex items-center gap-2 text-gray-300">
                <GlassWater size={16} />
                <span>{selectedCocktail.strGlass}</span>
              </div>

              <div className="bg-neutral-600 rounded-lg p-4">
                <h5 className="font-medium text-gray-200 mb-2">Ingredients:</h5>
                <ul className="space-y-2">
                  {getIngredients(selectedCocktail).map((item, index) => (
                    <li key={index} className="text-gray-300">
                      • {item.measure} {item.ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-neutral-600 rounded-lg p-4">
                <h5 className="font-medium text-gray-200 mb-2">Instructions:</h5>
                <p className="text-gray-300">{selectedCocktail.strInstructions}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Search size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a cocktail to view its recipe</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CocktailFinder;