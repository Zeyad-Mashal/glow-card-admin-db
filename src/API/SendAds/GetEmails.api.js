const URL = "https://glow-card.onrender.com/api/v1/card/get";
const token = localStorage.getItem("token");
const GetEmails = async (page, setloading, setError, setAllData) => {
    setloading(true)
    try {
        const response = await fetch(`${URL}?page=${page}&types=`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`,
                "x-is-notification": "true"
            },
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setAllData(result.cards)

        } else {
            if (response.status == 404) {
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
    }
}
export default GetEmails;