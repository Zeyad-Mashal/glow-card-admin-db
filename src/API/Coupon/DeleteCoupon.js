const URL = "https://glow-card.onrender.com/api/v1/coupon/delete/";
const token = localStorage.getItem('token');
const DeleteCoupon = async (setLoading, setError, id, setModal, getAllCoupons) => {
    setLoading(true)
    try {
        const response = await fetch(`${URL}${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`
            },
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            setModal(false);
            getAllCoupons()
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
export default DeleteCoupon;