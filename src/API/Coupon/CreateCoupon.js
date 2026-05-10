const URL = "https://glow-card.onrender.com/api/v1/coupon/create";

const parseJsonSafe = (text) => {
  if (!text || typeof text !== "string") return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text.slice(0, 280), raw: true };
  }
};

/**
 * إنشاء كوبون — الباك يتوقع JSON (مش multipart).
 * الحقول كما يعرّفها الموديل عادةً camelCase.
 */
const CreateCoupon = async (setloading, setError, data, setModal, getAllCoupons) => {
  setloading(true);
  try {
    const token = localStorage.getItem("token");

    const payload = {
      coupon: data.coupon,
      discount: Number(data.discount),
      startingDate: data.startingDate,
      expiryDate: data.expiryDate,
      active: Boolean(data.active),
      type: data.type,
      maxUses: Number(data.maxUses),
    };

    const bodyString = JSON.stringify(payload);
    console.log("[Coupon][create] POST JSON:", bodyString);

    const response = await fetch(URL, {
      method: "POST",
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
      setloading(false);
      setModal({ type: null, open: false, id: null });
      getAllCoupons();
    } else {
      const msg =
        result?.message ||
        result?.error ||
        (response.status === 502
          ? "502 Bad Gateway — تحقق من السيرفر أو حقل maxUses في الـ API."
          : `خطأ ${response.status}`);
      setError(msg);
      console.warn("[Coupon][create] failed", response.status, rawText?.slice(0, 500));
      setloading(false);
    }
  } catch (error) {
    setError("An error occurred");
    setloading(false);
    console.log(error);
  }
};

export default CreateCoupon;
