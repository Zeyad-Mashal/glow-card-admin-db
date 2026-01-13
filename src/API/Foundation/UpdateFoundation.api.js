const URL = "https://glow-card.onrender.com/api/v1/foundation/update/";
const token = localStorage.getItem('token');
const UpdateFoundation = async (setLoading, setError, foundationId, setShowUpdateModal, data, getAllFoundations) => {
    setLoading(true)
    try {
        const response = await fetch(`${URL}${foundationId}`, {
            method: 'PUT',
            headers: {
                "authorization": `glowONW${token}`
            },
            body: data,
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            setShowUpdateModal(false);
            getAllFoundations()
        } else {
            if (response.status == 400) {
                setError(result.message)
                setLoading(false);
            } else if (response.status == 404) {
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
export default UpdateFoundation;

