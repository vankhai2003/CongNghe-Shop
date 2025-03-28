import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

export default {
    data() {
        return {
            products: [],
        };
    },
    created() {
        axios.get('/api/products')
            .then(response => {
                this.products = response.data;
            })
            .catch(error => {
                console.error("There was an error fetching the products!", error);
            });
    },
};
