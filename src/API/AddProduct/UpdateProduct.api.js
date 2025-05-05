const URL = "https://glow-card.onrender.com/api/v1/product/update/";
const token = localStorage.getItem('token');
const UpdateProduct = async (setLoading, setError, productId, setShowEditModal, data, getAllProducts) => {
    setLoading(true)
    try {
        const response = await fetch(`${URL}${productId}`, {
            method: 'PUT',
            headers: {
                "authorization": `glowONW${token}`
            },
            body: data
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            setShowEditModal(false);
            getAllProducts();
        } else {
            if (response.status == 404) {
                setError(result.message)
                setLoading(false);
            } else if (response.status == 500) {
                console.log(result.message);
                setError(result.message)
                setLoading(false);
            }
            setLoading(false)
        }
    } catch (error) {
        setError('An error occurred');
        setLoading(false)
    }
}
export default UpdateProduct;