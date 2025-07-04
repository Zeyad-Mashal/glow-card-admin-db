const URL = "https://glow-card.onrender.com/api/v1/category/get";

const AllCategories = async (setloading, setError, setAllCategories) => {
    setloading(true)
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "accept-language": "ar"
            },
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setAllCategories(result.categories)
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
export default AllCategories;