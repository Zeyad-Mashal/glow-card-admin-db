const URL = "https://glow-card.onrender.com/api/v1/coupon/update/";

const parseJsonSafe = (text) => {
  if (!text || typeof text !== "string") return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text.slice(0, 280), raw: true };
  }
};

const EditCoupon = async (setLoading, setError, id, setModal, getAllCoupons, data) => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");

    const payload = {
      coupon: data.coupon,
      discount: Number(data.discount),
      startingDate: data.startingDate,
      expiryDate: data.expiryDate,
      type: data.type,
      maxUses: Number(data.maxUses),
    };

    const bodyString = JSON.stringify(payload);
    console.log("[Coupon][update] PUT JSON:", bodyString);

    const response = await fetch(`${URL}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `glowONW${token}`,
        "x-is-dashboard": "true",
      },
      body: bodyString,
    });

    const rawText = await response.text();
    const result = parseJsonSafe(rawText);

    if (response.ok) {
      setLoading(false);
      setModal({ type: null, open: false, id: null });
      getAllCoupons();
    } else {
      const msg =
        result?.message ||
        result?.error ||
        (response.status === 502
          ? "502 Bad Gateway — تحقق من السيرفر."
          : `خطأ ${response.status}`);
      setError(msg);
      console.warn("[Coupon][update] failed", response.status, rawText?.slice(0, 500));
      setLoading(false);
    }
  } catch (error) {
    setError("An error occurred");
    setLoading(false);
  }
};

export default EditCoupon;
