import { OptionItem } from "./types";

export const THEMES: OptionItem[] = [
  { value: "Sci-Fi", label: { en: "Sci-Fi / Cyberpunk", zh: "科幻 / 赛博朋克" } },
  { value: "Noir", label: { en: "Noir / Mystery", zh: "黑色电影 / 悬疑" } },
  { value: "Fantasy", label: { en: "High Fantasy", zh: "奇幻史诗" } },
  { value: "Horror", label: { en: "Horror / Thriller", zh: "恐怖 / 惊悚" } },
  { value: "Western", label: { en: "Western", zh: "西部片" } },
  { value: "Documentary", label: { en: "Documentary Realism", zh: "纪实风格" } },
  { value: "Vintage", label: { en: "Vintage / Retro 80s", zh: "复古 / 80年代" } },
  { value: "Cinematic", label: { en: "Modern Cinematic", zh: "现代电影感" } }
];

export const COMPOSITIONS: OptionItem[] = [
  { value: "Rule of Thirds", label: { en: "Rule of Thirds", zh: "三分法" } },
  { value: "Center Framed", label: { en: "Center Framed / Wes Anderson", zh: "居中构图" } },
  { value: "Symmetrical", label: { en: "Symmetrical", zh: "对称构图" } },
  { value: "Leading Lines", label: { en: "Leading Lines", zh: "引导线" } },
  { value: "Golden Ratio", label: { en: "Golden Ratio", zh: "黄金比例" } },
  { value: "Negative Space", label: { en: "Negative Space", zh: "留白" } },
  { value: "Framing", label: { en: "Frame within a Frame", zh: "框式构图" } },
  { value: "Dutch Angle", label: { en: "Dutch Angle (Tilt)", zh: "荷兰角 (倾斜)" } }
];

export const ARTISTS: OptionItem[] = [
  { value: "Roger Deakins", label: { en: "Roger Deakins (Clean, Contrast)", zh: "罗杰·狄金斯 (干净, 对比)" } },
  { value: "Wes Anderson", label: { en: "Wes Anderson (Pastel, Symm)", zh: "韦斯·安德森 (粉彩, 对称)" } },
  { value: "Ridley Scott", label: { en: "Ridley Scott (Atmospheric)", zh: "雷德利·斯科特 (氛围感)" } },
  { value: "Christopher Nolan", label: { en: "Christopher Nolan (IMAX, Scale)", zh: "克里斯托弗·诺兰 (宏大, 实拍)" } },
  { value: "Wong Kar-wai", label: { en: "Wong Kar-wai (Step-print, Neon)", zh: "王家卫 (抽帧, 霓虹)" } },
  { value: "Denis Villeneuve", label: { en: "Denis Villeneuve (Brutalist)", zh: "丹尼斯·维伦纽瓦 (极简, 巨物)" } },
  { value: "Tim Burton", label: { en: "Tim Burton (Gothic)", zh: "蒂姆·波顿 (哥特)" } },
  { value: "Zack Snyder", label: { en: "Zack Snyder (High Contrast, Slo-mo)", zh: "扎克·施奈德 (高对比, 慢动作)" } }
];

export const COLOR_GRADES: OptionItem[] = [
  { value: "Teal and Orange", label: { en: "Teal and Orange (Blockbuster)", zh: "青橙色调 (大片感)" } },
  { value: "Black and White", label: { en: "Black and White / Noir", zh: "黑白 / 黑色电影" } },
  { value: "Neon Vaporwave", label: { en: "Neon / Vaporwave", zh: "霓虹 / 蒸汽波" } },
  { value: "Vintage Kodachrome", label: { en: "Vintage Kodachrome", zh: "复古柯达胶片" } },
  { value: "Desaturated", label: { en: "Desaturated / Bleach Bypass", zh: "低饱和 / 漂白效果" } },
  { value: "Pastel", label: { en: "Pastel / Dreamy", zh: "粉彩 / 梦幻" } },
  { value: "Warm Golden", label: { en: "Warm / Golden Hour", zh: "暖调 / 黄金时刻" } },
  { value: "Cool Blue", label: { en: "Cool / Blue Hour", zh: "冷调 / 蓝调时刻" } }
];

export const ATMOSPHERES: OptionItem[] = [
  { value: "Foggy", label: { en: "Foggy / Misty", zh: "迷雾 / 朦胧" } },
  { value: "Rainy", label: { en: "Rainy / Wet Streets", zh: "雨天 / 湿润街道" } },
  { value: "Dusty", label: { en: "Dusty / Haze", zh: "尘土 / 雾霾" } },
  { value: "Cinematic Haze", label: { en: "Volumetric Lighting / God Rays", zh: "体积光 / 丁达尔效应" } },
  { value: "Snowing", label: { en: "Snowing / Blizzard", zh: "下雪 / 暴风雪" } },
  { value: "Smoke", label: { en: "Smoke / Steam", zh: "烟雾 / 蒸汽" } },
  { value: "Sparks", label: { en: "Embers / Sparks", zh: "火星 / 余烬" } },
  { value: "Lens Flares", label: { en: "Anamorphic Lens Flares", zh: "变形镜头光斑" } }
];

export const F_STOPS = ["f/0.95", "f/1.2", "f/1.4", "f/1.8", "f/2.0", "f/2.8", "f/4.0", "f/5.6", "f/8.0", "f/11", "f/16", "f/22", "f/32"];

export const SHUTTER_ANGLES = [
  "11.25° (Skinny / Staccato)", 
  "45° (High Action)", 
  "90° (Crisp)", 
  "144°", 
  "172.8°", 
  "180° (Standard)", 
  "270° (Smooth)", 
  "360° (Dreamy / Blur)"
];

export const SENSOR_FORMATS = [
  "IMAX 70mm (15-perf)",
  "Arri Alexa 65 (Large Format)",
  "VistaVision",
  "Full Frame 35mm",
  "Super 35",
  "Micro 4/3",
  "16mm Film",
  "8mm Vintage"
];

export const LIGHTING_TYPES = [
  "Natural / Sunlight",
  "Softbox / Diffused",
  "Hard Light / Spotlight",
  "Rembrandt Lighting",
  "Rim Light / Backlight",
  "Neon / Practical",
  "Ring Light (Beauty)",
  "Cinematic Top Light"
];

export const LIGHTING_TEMPS = [
  "Neutral (5600K)",
  "Warm / Golden (3200K)",
  "Cool / Blue (7000K+)",
  "Neon Red",
  "Neon Blue",
  "Neon Green",
  "Candlelight"
];

export const CHARACTER_COUNTS: OptionItem[] = [
  { value: "1", label: { en: "Solo (1)", zh: "单人主角" } },
  { value: "2", label: { en: "Duo (2)", zh: "双人互动" } },
  { value: "3+", label: { en: "Group (3-5)", zh: "三人/小队" } },
  { value: "crowd", label: { en: "Crowd", zh: "群像/人海" } }
];

export const CHARACTER_ARRANGEMENTS: Record<string, OptionItem[]> = {
  "1": [
    { value: "Center Frame", label: { en: "Center Frame", zh: "居中独白" } },
    { value: "Rule of Thirds", label: { en: "Rule of Thirds", zh: "三分法偏置" } },
    { value: "Off-screen Gaze", label: { en: "Off-screen Gaze", zh: "凝视画外" } },
    { value: "Back to Camera", label: { en: "Back to Camera", zh: "背对镜头" } },
    { value: "Extreme Close-up", label: { en: "Extreme Close-up (Eyes)", zh: "极致特写 (眼部/局部)" } },
    { value: "Silhouette", label: { en: "Silhouette", zh: "剪影轮廓" } },
    { value: "Reflection in Mirror", label: { en: "Reflection in Mirror", zh: "镜中倒影" } },
    { value: "Looking Down", label: { en: "Looking Down (God's Eye)", zh: "俯视/上帝视角" } },
    { value: "Looking Up", label: { en: "Looking Up (Heroic)", zh: "仰视/英雄视角" } },
    { value: "Walking Away", label: { en: "Walking Away", zh: "渐行渐远" } },
    { value: "Running Towards Camera", label: { en: "Running Towards Camera", zh: "奔向镜头" } },
    { value: "Profile View", label: { en: "Profile / Side View", zh: "侧颜特写" } },
    { value: "Lying Down", label: { en: "Lying Down (Top Down)", zh: "躺姿俯拍" } },
    { value: "Sitting on Edge", label: { en: "Sitting on Edge", zh: "边缘坐姿" } },
    { value: "Peeking Around Corner", label: { en: "Peeking Around Corner", zh: "转角窥视" } },
    { value: "Dynamic Action Jump", label: { en: "Dynamic Action Jump", zh: "动态跳跃/滞空" } },
    { value: "Floating / Weightless", label: { en: "Floating / Weightless", zh: "悬浮/失重" } },
    { value: "Shadow Interaction", label: { en: "Shadow Interaction", zh: "光影互动" } },
    { value: "Framed by Environment", label: { en: "Framed by Environment", zh: "环境框式构图 (窗/门)" } },
    { value: "Negative Space Dominance", label: { en: "Negative Space Dominance", zh: "大面积留白" } }
  ],
  "2": [
    { value: "Face to Face", label: { en: "Face to Face", zh: "面对面 (对峙/亲密)" } },
    { value: "Side by Side", label: { en: "Side by Side", zh: "并肩同行" } },
    { value: "Back to Back", label: { en: "Back to Back", zh: "背对背 (战斗/疏离)" } },
    { value: "Over the Shoulder", label: { en: "Over the Shoulder", zh: "过肩视角 (对话)" } },
    { value: "Foreground/Background", label: { en: "Foreground/Background", zh: "前景/背景分离" } },
    { value: "Dancing / Embrace", label: { en: "Dancing / Embrace", zh: "拥舞/拥抱" } },
    { value: "Chasing", label: { en: "Chasing", zh: "追逐 (一前一后)" } },
    { value: "Mirror Image", label: { en: "Mirror Image (Symmetrical)", zh: "镜像对称" } },
    { value: "Whisper in Ear", label: { en: "Whisper in Ear", zh: "耳语/私密" } },
    { value: "Holding Hands", label: { en: "Holding Hands", zh: "牵手特写" } },
    { value: "One Sitting One Standing", label: { en: "One Sitting, One Standing", zh: "一坐一站 (地位差)" } },
    { value: "Yin Yang Composition", label: { en: "Yin Yang Composition", zh: "阴阳构图 (俯拍躺姿)" } },
    { value: "Leading by Hand", label: { en: "Leading by Hand (POV)", zh: "牵手第一人称 (POV)" } },
    { value: "Fighting / Grappling", label: { en: "Fighting / Grappling", zh: "格斗/扭打" } },
    { value: "Kissing", label: { en: "Kissing / About to Kiss", zh: "吻/欲吻瞬间" } },
    { value: "Walk and Talk", label: { en: "Walk and Talk", zh: "边走边谈 (跟拍)" } },
    { value: "One Looking One Away", label: { en: "One Looking, One Away", zh: "一人凝视一人回避" } },
    { value: "Silhouette against Light", label: { en: "Silhouette against Light", zh: "逆光剪影 (双人)" } },
    { value: "Reflections", label: { en: "Reflections", zh: "倒影中的双人" } },
    { value: "Vertically Stacked", label: { en: "Vertically Stacked", zh: "垂直高低位 (楼梯/梯子)" } }
  ],
  "3+": [
    { value: "Triangle Formation", label: { en: "Triangle Formation", zh: "三角构图 (稳定/冲突)" } },
    { value: "Linear Line-up", label: { en: "Linear Line-up", zh: "一字排开 (嫌疑人/英雄)" } },
    { value: "Circular Ring", label: { en: "Circular / Ring", zh: "环形围坐/站立" } },
    { value: "Scattered", label: { en: "Scattered", zh: "随机散点 (混乱/自然)" } },
    { value: "V-Formation", label: { en: "V-Formation", zh: "V字队形 (领袖中心)" } },
    { value: "Pyramidal Stacking", label: { en: "Pyramidal Stacking", zh: "金字塔叠罗汉" } },
    { value: "Dinner Table", label: { en: "Dinner Table", zh: "聚餐/最后晚餐式" } },
    { value: "Converging on Center", label: { en: "Converging on Center", zh: "向心聚拢" } },
    { value: "Walking in Slow Motion", label: { en: "Walking in Slow Motion", zh: "慢动作齐步走" } },
    { value: "Huddle", label: { en: "Huddle", zh: "围成一团 (密谋/加油)" } },
    { value: "Staggered Depth", label: { en: "Staggered Depth", zh: "纵深错落排列" } },
    { value: "Looking in Different Directions", label: { en: "Looking in Different Directions", zh: "各怀心事 (视线离散)" } },
    { value: "Follow the Leader", label: { en: "Follow the Leader", zh: "雁行/跟随" } },
    { value: "Carrying/Lifting", label: { en: "Carrying/Lifting", zh: "抬举/欢庆" } },
    { value: "Circle of Trust", label: { en: "Circle of Trust (Looking Inwards)", zh: "围圈向内 (俯拍)" } },
    { value: "Backs Turned", label: { en: "Backs Turned", zh: "集体背影" } },
    { value: "Framing the Void", label: { en: "Framing the Void", zh: "围合留空" } },
    { value: "Dynamic Action Scatter", label: { en: "Dynamic Action Scatter", zh: "爆炸四散反应" } },
    { value: "Stadium Seating", label: { en: "Stadium Seating", zh: "阶梯式站位" } },
    { value: "Reflection Group", label: { en: "Reflection Group", zh: "大镜面/水面群像" } }
  ],
  "crowd": [
    { value: "Dense Packing", label: { en: "Dense Packing", zh: "密集拥挤 (无空隙)" } },
    { value: "Organized Formation", label: { en: "Organized Formation", zh: "军队/阅兵方阵" } },
    { value: "Chaos/Panic", label: { en: "Chaos/Panic", zh: "混乱/四散逃离" } },
    { value: "Audience/Spectators", label: { en: "Audience/Spectators", zh: "观众席 (视线统一)" } },
    { value: "Sea of Faces", label: { en: "Sea of Faces", zh: "人脸海洋" } },
    { value: "Mosh Pit / Rave", label: { en: "Mosh Pit / Rave", zh: "狂欢/舞池" } },
    { value: "Commuter Flow", label: { en: "Commuter Flow (Motion Blur)", zh: "人流穿梭 (动态模糊)" } },
    { value: "Protest / March", label: { en: "Protest / March", zh: "游行示威 (举牌/口号)" } },
    { value: "Circle Pit", label: { en: "Circle Pit", zh: "环形人墙 (空出中心)" } },
    { value: "Looking Up", label: { en: "Looking Up", zh: "集体仰望 (敬畏/恐惧)" } },
    { value: "Silhouettes in Fog", label: { en: "Silhouettes in Fog", zh: "迷雾剪影群" } },
    { value: "Pixelated Pattern", label: { en: "Pixelated Pattern", zh: "团体操/拼图" } },
    { value: "Zombie Horde", label: { en: "Zombie Horde", zh: "丧尸/行尸走肉群" } },
    { value: "Red Carpet Paparazzi", label: { en: "Red Carpet Paparazzi", zh: "记者/狗仔包围" } },
    { value: "Battle Charge", label: { en: "Battle Charge", zh: "冲锋对撞" } },
    { value: "Market Bustle", label: { en: "Market Bustle", zh: "集市喧嚣" } },
    { value: "Religious Gathering", label: { en: "Religious Gathering", zh: "朝圣/膜拜" } },
    { value: "Aftermath", label: { en: "Aftermath", zh: "战场/灾难躺倒" } },
    { value: "Cheerleader Pyramid", label: { en: "Cheerleader Pyramid", zh: "啦啦队叠高" } },
    { value: "Infinite Reflection", label: { en: "Infinite Reflection", zh: "镜厅无限人影" } }
  ]
};

export const UI_TEXT = {
  en: {
    appTitle: "CinePrompt AI",
    tabs: { generator: "Generator", reverse: "Reverse Engineer" },
    visualizerTitle: "3D PREVIEW",
    naturalPrompt: "Visual Description",
    copy: "Copy",
    upload: {
      title: "Upload Reference",
      desc: "Drop an image here or click to upload",
      contextPlaceholder: "Add context (e.g., 'This is a sci-fi movie scene')...",
      analyzeButton: "Reverse Engineer Shot"
    },
    analyzing: "Analyzing...",
    generateModified: "Generate Modified Prompt",
    reAnalyze: "Re-Analyze Image",
    sections: {
      subject: "Subject & Staging",
      artist: "Art Direction",
      theme: "Theme",
      composition: "Composition",
      color: "Color Grade",
      atmosphere: "Atmosphere"
    },
    labels: {
      characterCount: "Character Count",
      characterArrangement: "Arrangement"
    },
    directorNotes: "Director's Notes",
    charDesc: "Character Appearance",
    charAction: "Action / Pose",
    sceneProps: "Clothing & Props / Environment",
    cameraRig: "Camera Rig",
    randomize: "Randomize",
    orbit: "Orbit (Azimuth)",
    angle: "Angle (Elevation)",
    distance: "Distance",
    dutchAngle: "Dutch Angle (Roll)",
    focalLength: "Focal Length",
    aperture: "Aperture",
    shutter: "Shutter",
    sensor: "Sensor",
    iso: "ISO",
    lightingStudio: "Lighting Studio",
    lightDir: "Direction",
    lightHeight: "Height",
    atmosphereGenerator: "Custom Atmosphere Generator",
    atmospherePlaceholder: "e.g., 'Neon rain in Tokyo'...",
    aiSuggestions: "AI Suggestions",
    computing: "Generating Prompt...",
    generateButton: "Generate Cinematic Prompt",
    copyJson: "Copy JSON",
    jsonOutput: "JSON Output"
  },
  zh: {
    appTitle: "CinePrompt AI",
    tabs: { generator: "生成器", reverse: "逆向工程" },
    visualizerTitle: "3D 预览",
    naturalPrompt: "视觉描述",
    copy: "复制",
    upload: {
      title: "上传参考图",
      desc: "拖放图片或点击上传",
      contextPlaceholder: "添加上下文 (例如：'这是一场科幻电影场景')...",
      analyzeButton: "逆向分析镜头"
    },
    analyzing: "分析中...",
    generateModified: "生成调整后的 Prompt",
    reAnalyze: "重新分析图片",
    sections: {
      subject: "主体 & 调度",
      artist: "艺术指导",
      theme: "主题",
      composition: "构图",
      color: "调色",
      atmosphere: "氛围"
    },
    labels: {
      characterCount: "角色数量",
      characterArrangement: "站位/排列"
    },
    directorNotes: "导演笔记",
    charDesc: "角色外观描述",
    charAction: "动作 / 姿态",
    sceneProps: "服装道具 / 环境",
    cameraRig: "摄影机机位",
    randomize: "随机",
    orbit: "水平轨道 (Azimuth)",
    angle: "俯仰角度 (Elevation)",
    distance: "距离",
    dutchAngle: "荷兰角 (Roll)",
    focalLength: "焦距",
    aperture: "光圈",
    shutter: "快门",
    sensor: "传感器",
    iso: "ISO",
    lightingStudio: "灯光布置",
    lightDir: "光照方向",
    lightHeight: "光照高度",
    atmosphereGenerator: "自定义氛围生成",
    atmospherePlaceholder: "例如：'东京霓虹雨夜'...",
    aiSuggestions: "AI 建议",
    computing: "生成提示词中...",
    generateButton: "生成电影级 Prompt",
    copyJson: "复制 JSON",
    jsonOutput: "JSON 输出"
  }
};

export const CAMERA_PRESETS: Record<string, {
  label: { en: string; zh: string };
  az: number;
  el: number;
  dist: number;
  focal: number;
  ap: string;
  shut: string;
  iso: number;
  sensor: string;
}> = {
  portrait: {
    label: { en: "Portrait", zh: "人像特写" },
    az: 15, el: 5, dist: 2, focal: 85, ap: "f/1.8", shut: "180° (Standard)", iso: 400, sensor: "Full Frame 35mm"
  },
  wide: {
    label: { en: "Wide/Establishing", zh: "广角定场" },
    az: 45, el: 20, dist: 8, focal: 24, ap: "f/8.0", shut: "180° (Standard)", iso: 100, sensor: "VistaVision"
  },
  action: {
    label: { en: "Action", zh: "动作场面" },
    az: 60, el: -10, dist: 4, focal: 35, ap: "f/2.8", shut: "45° (High Action)", iso: 800, sensor: "Super 35"
  },
  macro: {
    label: { en: "Macro/Detail", zh: "微距细节" },
    az: 0, el: 45, dist: 1, focal: 100, ap: "f/2.8", shut: "180° (Standard)", iso: 200, sensor: "Full Frame 35mm"
  },
  cinematic: {
    label: { en: "Cinematic", zh: "电影感" },
    az: 30, el: 0, dist: 5, focal: 50, ap: "f/2.0", shut: "180° (Standard)", iso: 800, sensor: "Arri Alexa 65 (Large Format)"
  }
};