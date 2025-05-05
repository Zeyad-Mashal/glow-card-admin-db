const URL = "https://glow-card.onrender.com/api/v1/product/add";
const token = localStorage.getItem('token');
const AddProduct = async (setloading, setError, data, setShowAddModal, getAllProducts) => {
    setloading(true)
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "authorization": `glowONW${token}`
            },
            body: data,
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            setloading(false);
            setShowAddModal(false);
            getAllProducts()
        } else {
            if (response.status == 400) {
                setError(result.message)
                setloading(false);
            } else if (response.status == 500) {
                console.log(result.message);
                setError(result.message)
                setloading(false);
            }
            setloading(false)
        }
    } catch (error) {
        setError('An error occurred');
        setloading(false)
        console.log(error);
    }
}

export default AddProduct;