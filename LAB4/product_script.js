fetch('product.json').then(function(response) {
    return response.json();
    }).then(function(json) {
        let products = json;
        initialize(products);
    }).catch(function(err) {
        console.log('Fetch problem: ' + err.message);
    });

function initialize(products) {
    const category = document.querySelector('#category');
    const searchTerm = document.querySelector('#searchTerm');
    const searchBtn = document.querySelector('button');
    const main = document.querySelector('main');

    // record of the last category and search that has been entered
    let lastCategory = category.value;
    // null
    let lastSearch = '';
    let categoryGroup = [];
    let finalGroup = [];
    finalGroup = products;
    // all products displayed initially
    updateDisplay();

    searchBtn.onclick = selectCategory;

    function selectCategory(e) {
        e.preventDefault();
        // clear
        categoryGroup = [];
        finalGroup = [];

        if(category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
        return;
        } else {
            // update
            lastCategory = category.value;
            lastSearch = searchTerm.value.trim();
            // set categoryGroup to the entire JSON object
            if(category.value === 'All') {
                categoryGroup = products;
                selectProducts();
            } else {
                let lowerCaseType = category.value.toLowerCase();
                for(let i = 0; i < products.length ; i++) {
                    if(products[i].type === lowerCaseType) {
                        categoryGroup.push(products[i]);
                    }
                }
                selectProducts();
            }
        }
    }

    function selectProducts() {
        // if no search term has been entered
        if(searchTerm.value.trim() === '') {
        finalGroup = categoryGroup;
        updateDisplay();
        } else {
            let lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
            for(let i = 0; i < categoryGroup.length ; i++) {
                if(categoryGroup[i].name.indexOf(lowerCaseSearchTerm) !== -1) {
                    finalGroup.push(categoryGroup[i]);
                }
            }
            updateDisplay();
        }
    }

    // update the display with new sets of products
    function updateDisplay() {
        // remove the previous contents
        while (main.firstChild) {
            main.removeChild(main.firstChild);
        }
        // when no products match the search term
        if(finalGroup.length === 0) {
            const para = document.createElement('p');
            para.textContent = 'No results to display!';
            main.appendChild(para);
        // pass its product object to fetchBlob()
        } else {
            for(let i = 0; i < finalGroup.length; i++) {
                fetchBlob(finalGroup[i]);
            }
        }
    }

    function fetchBlob(product) {
    // construct the URL path to the image file from the product.image property
        let url = 'images/' + product.image;
    // Fetch image, convert response to a blob
        fetch(url).then(function(response) {
            return response.blob();
        }).then(function(blob) {
            // Convert the blob to an object URL 
            let objectURL = URL.createObjectURL(blob);
            showProduct(objectURL, product);
        });
    }

    function showProduct(objectURL, product) {
        const section = document.createElement('section');
        const heading = document.createElement('h2');
        const para = document.createElement('p');
        const image = document.createElement('img');
        section.setAttribute('class', product.type);
        image.src = objectURL;
        image.alt = product.name;
        main.appendChild(section);
        section.appendChild(heading);
        section.appendChild(para);
        section.appendChild(image);
    }
}