/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const sortedProducts = (
  sortByUser,
  sortByInp,
  { Grocery, Drinks, Fruits, Electronics, Clothes },
  sortbyTabeOptions,
) => {
  const productsWithCategories = productsFromServer.map(product => {
    return {
      ...product,
      category: categoriesFromServer.find(
        category => category.id === product.categoryId,
      ),
    };
  });

  let products = productsWithCategories.map(product => {
    return {
      ...product,
      user: usersFromServer.find(user => product.category.ownerId === user.id),
    };
  });

  if (sortByUser !== 'all') {
    products = products.filter(el => {
      return el.user.name.toLowerCase().includes(sortByUser.toLowerCase());
    });
  }

  if (sortByInp) {
    products = products.filter(el => {
      return (
        el.name.toLowerCase().includes(sortByInp.toLowerCase()) ||
        el.user.name.toLowerCase().includes(sortByInp.toLowerCase())
      );
    });
  }

  const catagoryList = [];

  const categoryChecks = (toCheckCategory, compareWith) => {
    if (toCheckCategory) {
      catagoryList.push(
        ...products.filter(el => el.category.title === compareWith),
      );
    }
  };

  if (Grocery || Drinks || Fruits || Electronics || Clothes) {
    categoryChecks(Grocery, 'Grocery');
    categoryChecks(Drinks, 'Drinks');
    categoryChecks(Fruits, 'Fruits');
    categoryChecks(Electronics, 'Electronics');
    categoryChecks(Clothes, 'Clothes');

    products = catagoryList;
  }

  const sortAllCategories = (sortByTableCategory, callback1, callback2) => {
    if (sortbyTabeOptions.category === sortByTableCategory) {
      if (sortbyTabeOptions.direction === 'upToDown') {
        products = products.sort(callback1);
      }

      if (sortbyTabeOptions.direction === 'downToUp') {
        products = products.sort(callback2);
      }
    }
  };

  if (sortbyTabeOptions.category) {
    sortAllCategories(
      'id',
      (a, b) => a.id - b.id,
      (a, b) => b.id - a.id,
    );

    sortAllCategories(
      'product',
      (a, b) => a.name.localeCompare(b.name),
      (a, b) => b.name.localeCompare(a.name),
    );

    sortAllCategories(
      'category',
      (a, b) => {
        return a.category.title.localeCompare(b.category.title);
      },
      (a, b) => {
        return b.category.title.localeCompare(a.category.title);
      },
    );

    sortAllCategories(
      'user',
      (a, b) => {
        return a.user.name.localeCompare(b.user.name);
      },
      (a, b) => {
        return b.user.name.localeCompare(a.user.name);
      },
    );
  }

  return products;
};

export const App = () => {
  const [sortByUser, setSortByUser] = useState('all');
  const [sortByInp, setSortByInp] = useState('');
  const [sortByCategory, setSortByCategory] = useState({
    Grocery: false,
    Drinks: false,
    Fruits: false,
    Electronics: false,
    Clothes: false,
  });
  const [sortbyTableOptions, setSortbyTableOptions] = useState({
    category: null,
    direction: null,
  });
  const productsData = sortedProducts(
    sortByUser,
    sortByInp,
    sortByCategory,
    sortbyTableOptions,
  );

  const tableTemplateChecks = compareWith => {
    if (sortbyTableOptions.category === compareWith || null) {
      if (!sortbyTableOptions.direction) {
        setSortbyTableOptions({
          category: compareWith,
          direction: 'upToDown',
        });
      } else if (sortbyTableOptions.direction === 'upToDown') {
        setSortbyTableOptions({
          category: compareWith,
          direction: 'downToUp',
        });
      } else {
        setSortbyTableOptions({
          category: null,
          direction: null,
        });
      }
    } else {
      setSortbyTableOptions({
        category: compareWith,
        direction: 'upToDown',
      });
    }
  };

  const sortTableRightArrow = compareWith => {
    return sortbyTableOptions.category === compareWith
      ? (sortbyTableOptions.direction === 'upToDown' && 'fa-sort-down') ||
          (sortbyTableOptions.direction === 'downToUp' && 'fa-sort-up') ||
          'fa-sort'
      : 'fa-sort';
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={() => setSortByUser('all')}
                data-cy="FilterAllUsers"
                href="#/"
                className={sortByUser === 'all' && 'is-active'}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  onClick={() => setSortByUser(user.name)}
                  data-cy="FilterUser"
                  href="#/"
                  className={user.name === sortByUser ? 'is-active' : ''}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={sortByInp}
                  onChange={event => {
                    setSortByInp(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {sortByInp !== '' && (
                    <button
                      onClick={() => {
                        // setSortByInp('');
                        setSortByInp('');
                      }}
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                className={`button is-success mr-6
                  ${
                    Object.entries(sortByCategory).some(el => el[1]) &&
                    'is-outlined'
                  }
                `}
                href="#/"
                data-cy="AllCategories"
                onClick={() => {
                  setSortByCategory({
                    Grocery: false,
                    Drinks: false,
                    Fruits: false,
                    Electronics: false,
                    Clothes: false,
                  });
                }}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${sortByCategory[category.title] ? 'is-info' : undefined}`}
                  href="#/"
                  onClick={() =>
                    setSortByCategory(prev => ({
                      ...prev,
                      [category.title]: !prev[category.title],
                    }))
                  }
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                onClick={() => {
                  setSortByUser('all');
                  setSortByInp('');
                  setSortByCategory({
                    Grocery: false,
                    Drinks: false,
                    Fruits: false,
                    Electronics: false,
                    Clothes: false,
                  });
                  setSortbyTableOptions({
                    category: null,
                    direction: null,
                  });
                }}
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {productsData.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a
                        href="#/"
                        onClick={() => {
                          tableTemplateChecks('id');
                        }}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={`fas ${sortTableRightArrow('id')}`}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a
                        href="#/"
                        onClick={() => {
                          tableTemplateChecks('product');
                        }}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={`fas ${sortTableRightArrow('product')}`}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a
                        href="#/"
                        onClick={() => {
                          tableTemplateChecks('category');
                        }}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={`fas ${sortTableRightArrow('category')}`}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a
                        href="#/"
                        onClick={() => {
                          tableTemplateChecks('user');
                        }}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={`fas ${sortTableRightArrow('user')}`}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {productsData.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        product.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
