const URL = "https://glow-card.onrender.com/api/v1/card/emails";
const token = localStorage.getItem("token");
const GetAllEmails = async (type, setloading, setError, setSelectedEmails, setShowModal) => {
    setloading(true)
    try {
        const response = await fetch(`${URL}?types=${type}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`,
            },
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setSelectedEmails(result.emails)
            if (result.emails.length === 0) {
                alert("No Any Emails Yet...")
                setSelectedEmails([])
            } else {
                setShowModal(true)
            }
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
export default GetAllEmails;