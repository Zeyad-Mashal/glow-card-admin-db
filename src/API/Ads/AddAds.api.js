const URL = "https://glow-card.onrender.com/api/v1/ads/add";
const token = localStorage.getItem('token');
const AddAds = async (setloading, setError, data, setShowModal, getAllBanners) => {
    setloading(true)
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "authorization": `glowONW${token}`
            },
            body: data,
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setShowModal(false);
            getAllBanners()
        } else {
            if (response.status == 400) {
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
export default AddAds;