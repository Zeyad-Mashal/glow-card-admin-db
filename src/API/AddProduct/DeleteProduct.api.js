const URL = "https://glow-card.onrender.com/api/v1/product/delete/";
const token = localStorage.getItem("token");
const DeleteProduct = async (setLoading, setError, productId, setShowDeleteModal, getAllProducts) => {
    setLoading(true)

    try {
        const response = await fetch(`${URL}${productId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`
            }
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            setShowDeleteModal(false);
            getAllProducts();
        } else {
            if (response.status == 403) {
                setError(result.message)
                setLoading(false);
            } else if (response.status == 404) {
                console.log(result.message);
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
export default DeleteProduct;