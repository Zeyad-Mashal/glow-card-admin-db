const URL = "https://glow-card.onrender.com/api/v1/user/add";
const token = localStorage.getItem('token');
const AddUser = async (setloading, setError, data, setShowAddModal, getAllUsers) => {
    setloading(true)
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setShowAddModal(false);
            getAllUsers()
        } else {
            if (response.status == 400) {
                setError(result.message)
                setloading(false);
                console.log(result.message);

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
    }
}
export default AddUser;