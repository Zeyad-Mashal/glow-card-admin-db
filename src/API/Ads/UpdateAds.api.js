const URL = "https://glow-card.onrender.com/api/v1/ads/update/";
const token = localStorage.getItem('token');
const UpdateAds = async (setLoading, setError, adsId, setShowEditModal, data, getAllBanners) => {
    setLoading(true)
    try {
        const response = await fetch(`${URL}${adsId}`, {
            method: 'PUT',
            headers: {
                "authorization": `glowONW${token}`
            },
            body: data
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            setShowEditModal(false);
            getAllBanners();
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
export default UpdateAds;