const URL = "https://glow-card.onrender.com/api/v1/user/delete/";
const token = localStorage.getItem('token');
const removeUser = async (setLoading, setError, id, setRemoveModel, getAllUsers) => {
    setLoading(true)
    try {
        const response = await fetch(`${URL}${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`,
                "x-is-notification": "true"
            },
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            setRemoveModel(false);
            getAllUsers()
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
export default removeUser;