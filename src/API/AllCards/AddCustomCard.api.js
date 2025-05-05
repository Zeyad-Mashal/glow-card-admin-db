const URL = "https://glow-card.onrender.com/api/v1/card/create/";
const token = localStorage.getItem('token');
const AddCustomCard = async (setloading, setError, formData, setShowModal, getAllCards, cutomId) => {
    setloading(true)
    try {
        const response = await fetch(`${URL}${cutomId}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            setloading(false);
            setShowModal(false);
            getAllCards();
        } else {
            if (response.status == 403) {
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

export default AddCustomCard;