const URL = "https://glow-card.onrender.com/api/v1/card/search";
const token = localStorage.getItem('token');

const SearchCards = async (setloading, setError, setAllCards, generalCode, code) => {
    setloading(true)
    try {
        const response = await fetch(`${URL}?generalCode=${generalCode}&code=${code}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`,
                "x-is-dashboard": "true"
            },
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setAllCards(result.cards)

        } else {
            if (response.status == 404) {
                setError(result.message)
                setloading(false);
            } else if (response.status == 400) {
                console.log(result.message);
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
export default SearchCards;