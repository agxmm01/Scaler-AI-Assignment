import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../Redux/Actions/cartActions.js';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/products/categories/list');
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let url = `http://localhost:8001/api/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=12`;
        
        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }

        if (sortBy === 'price_low') {
          url += `&sort=price&order=asc`;
        } else if (sortBy === 'price_high') {
          url += `&sort=price&order=desc`;
        } else if (sortBy === 'discount') {
          url += `&sort=discount&order=desc`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setResults(data.products);
          setTotalPages(Math.ceil(data.total / 12));
        } else {
          setError('No results found');
          setResults([]);
        }
      } catch (err) {
        setError('Error fetching results');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, selectedCategory, sortBy, page]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await dispatch(addToCart(product.id, 1));
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const handleBuyNow = async (e, productId) => {
    e.stopPropagation();
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await dispatch(addToCart(productId, 1));
      navigate('/checkout');
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  return (
    <div className="search-results-page">
      <div className="search-results-header">
        <h1>Search Results</h1>
        <p className="search-query">
          {query ? `Results for: "${query}"` : 'No search query provided'}
        </p>
      </div>

      <div className="search-results-container">
        {/* Filters Sidebar */}
        <div className="search-filters">
          <h3>Filter Results</h3>

          <div className="filter-group">
            <label>Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="relevance">Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="discount">Discount: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        <div className="search-results-content">
          {loading && <div className="loading">Loading...</div>}

          {error && !loading && (
            <div className="no-results">
              <p>{error}</p>
              <button 
                className="browse-btn"
                onClick={() => navigate('/')}
              >
                Browse All Products
              </button>
            </div>
          )}

          {results.length > 0 && !loading && (
            <>
              <div className="results-count">
                Showing {results.length} results
              </div>

              <div className="results-grid">
                {results.map(product => (
                  <div 
                    key={product.id} 
                    className="product-card search-product-card"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="product-image">
                      <img 
                        src={product.image_url || 'https://via.placeholder.com/150'} 
                        alt={product.name}
                      />
                      {product.discount > 0 && (
                        <div className="discount-badge">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>

                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      
                      <div className="product-prices">
                        <span className="price">₹{product.price}</span>
                        {product.mrp > product.price && (
                          <span className="mrp">₹{product.mrp}</span>
                        )}
                      </div>

                      <div className="product-stock">
                        {product.stock > 0 ? (
                          <span className="in-stock">✓ In Stock</span>
                        ) : (
                          <span className="out-of-stock">✗ Out of Stock</span>
                        )}
                      </div>

                      <div className="product-actions">
                        <button 
                          className="btn-cart"
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={product.stock === 0}
                        >
                          Add to Cart
                        </button>
                        <button 
                          className="btn-buynow"
                          onClick={(e) => handleBuyNow(e, product.id)}
                          disabled={product.stock === 0}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={page === p ? 'active' : ''}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {results.length === 0 && !loading && !error && (
            <div className="no-results">
              <p>No products found. Try another search!</p>
              <button 
                className="browse-btn"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
