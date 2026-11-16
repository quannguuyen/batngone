export interface PolaroidWishItem {
  id: string;
  theme: "Sức khỏe" | "Hạnh phúc" | "Thành công" | "Xinh đẹp";
  caption: string;
  message: string;
  tiltDeg: number;
  masonryOffsetClass: string;
  initialLikes: number;
  icon: "health" | "happiness" | "success" | "beauty";
}

export const HERO_CONTENT = {
  title: "Happy Birthday Chị Chang!",
  scrollCue: "chị chang lướt xuống nha",
} as const;

export const CAKE_COPY = {
  wishPrompt: "chị chang hãy nhắm mắt ước 1 điều ước và thổi nến ik",
  blowCta: "Thổi nến",
  relightCta: "Thắp lại nến",
  giftRevealMessage:
    "Đây là món quà em dành tặng Chị Chang, đó là mọi điều ước chị hằng mong rồi sẽ thành sự thật!!!!",
} as const;

export const LOVE_LETTER_CONTENT = {
  heading: "Gửi chị chang",
  meta: "(Chị chang nhớ đọc hết nha)",
  paragraphs: [
    "Nay là Chang'day một ngày rất đặc biệt em chúc chị có một ngày thật vui vẻ nha và ko chỉ hôm nay mà tất cả mọi ngày về sau của chị chang đều happi happi nha. Dù có khó khăn thử thách gì chị cũng sẽ vượt qua hết nha ko gì có thể cản được chị chang hết. Chúc chị có full điểm A và nhìu may mắn nha. Chúc cho gia đình chị nhìu sức khoẻ nha. Dù em ở nghìn dặm xa xôi nhưng em vẫn nghĩ về chị 😃😃😃😃😃. 🐸🐸🐸🐸",
  ],
} as const;

export const POLAROID_WISHES: readonly PolaroidWishItem[] = [
  {
    id: "health",
    theme: "Sức khỏe",
    caption: "Bình an & Dồi dào năng lượng",
    message:
      "Chúc Chị Chang luôn khỏe mạnh, ngủ ngon mỗi tối và tràn đầy sức sống mỗi ngày mới.",
    tiltDeg: -1.8,
    masonryOffsetClass: "",
    initialLikes: 20,
    icon: "health",
  },
  {
    id: "happiness",
    theme: "Hạnh phúc",
    caption: "Ngập tràn tiếng cười",
    message:
      "Mong mọi khoảnh khắc bên gia đình và những người thương yêu đều ngọt ngào như hoa.",
    tiltDeg: 1.4,
    masonryOffsetClass: "sm:mt-6 lg:mt-8",
    initialLikes: 24,
    icon: "happiness",
  },
  {
    id: "success",
    theme: "Thành công",
    caption: "Vững bước & Tỏa sáng",
    message:
      "Mọi mục tiêu và ước mơ ấp ủ đều nở hoa rực rỡ, gặt hái thật nhiều thành tựu mới.",
    tiltDeg: -1.2,
    masonryOffsetClass: "",
    initialLikes: 18,
    icon: "success",
  },
  {
    id: "beauty",
    theme: "Xinh đẹp",
    caption: "Rạng ngời nét thanh xuân",
    message:
      "Chúc chị mãi trẻ trung, duyên dáng, tự tin và luôn rạng rỡ như ánh nắng ban mai.",
    tiltDeg: 1.8,
    masonryOffsetClass: "sm:mt-6 lg:mt-8",
    initialLikes: 30,
    icon: "beauty",
  },
];
