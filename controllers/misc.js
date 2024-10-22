const blankPage = (req, res) => {
    res.status(400).json({ message: "Page not found. Kindly hit a get request to /api for all the endpoints details" })
}


const getAPI = (req, res) => {
    const data = `
        Cart API Endpoints:
        -------------------------------------------------------------------------------------------
        POST http://localhost:3000/cart/add: Add a product to the cart. (Roles: user, admin)
        GET http://localhost:3000/cart/total: Get the total cart value for a user. (Roles: user, admin)
        DELETE http://localhost:3000/cart/delete: Remove a product from the cart. (Roles: user, admin)


        Order API Endpoints:
        -------------------------------------------------------------------------------------------
        POST http://localhost:3000/orders/place: Place an order. (Roles: user, admin)
        GET http://localhost:3000/orders/all: Get all orders. (Roles: user, admin)
        DELETE http://localhost:3000/orders/delete: Delete an order. (Roles: user, admin)
        GET http://localhost:3000/orders/getOrder: Get order details by order ID. (Roles: user, admin)


        Product API Endpoints:
        -------------------------------------------------------------------------------------------
        POST http://localhost:3000/products/add: Create a new product. (Roles: admin)
        GET http://localhost:3000/products/all: Get all products.
        GET http://localhost:3000/products/getProduct: Get product details by product ID.
        GET http://localhost:3000/products/category: Get products by category.
        DELETE http://localhost:3000/products/deleteProduct: Delete a product by product ID. (Roles: admin)
        PUT http://localhost:3000/products/:product_id/updateQuantity: Update product quantity. (Roles: admin)


        User API Endpoints:
        -------------------------------------------------------------------------------------------
        POST http://localhost:3000/users/signup: User sign-up.
        POST http://localhost:3000/users/login: User login.
        GET http://localhost:3000/users/all: Get all users. (Roles: admin)
        DELETE http://localhost:3000/users/delete: Delete a user by email. (Roles: admin)
        PUT http://localhost:3000/users/update: Update user address by email. (Roles: admin, user)
    `;
    res.status(200).send(data);
}


module.exports = {
    getAPI,
    blankPage
}