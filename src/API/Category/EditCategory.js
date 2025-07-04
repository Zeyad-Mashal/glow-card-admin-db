const URL = "https://glow-card.onrender.com/api/v1/category/update/";
const token = localStorage.getItem('token');
const EditCategory = async (setLoading, setError, id, setModel, data, getAllCategories) => {
    setLoading(true)
    try {
        const response = await fetch(`${URL}${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            setModel(false);
            getAllCategories()
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
export default EditCategory;