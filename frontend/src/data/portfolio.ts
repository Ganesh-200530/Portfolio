

export const profileData = {
  name: "Your Name",
  role: "Data Scientist",
  resume_url: "/resume.pdf", // Ensure resume.pdf is in the public folder
  about: "Data Scientist with a passion for uncovering insights from complex datasets."
};

export const socialData = [
  { platform: "GitHub", url: "https://github.com/yourusername", label: "GitHub" }, // Used for project code links
  { platform: "LinkedIn", url: "https://linkedin.com/in/yourusername", label: "LinkedIn" },
  { platform: "Email", url: "mailto:mamidiganesh05@gmail.com", label: "Email" }
];

export const educationData = [

  {
    institution: "Vel Tech Rangarajan Dr.Sagunthala R&D Institute of Science and Technology",
    degree: "Bachelor of Engineering - Computer Science (Data Science)",
    start_year: "2022",
    end_year: "2026",
    focus: "Computer Science (Data Science)",
    location: "Chennai, India",
    order_index: 1
  },
  {
    institution: "Kamaraj English Medium School",
    degree: "Higher Secondary",
    start_year: "2021",
    end_year: "2022",
    focus: "MPC",
    location: "Port Blair, India",
    order_index: 2
  },
  {
    institution: "Kamaraj English Medium School",
    degree: "Secondary School",
    start_year: "2019",
    end_year: "2020",
    focus: "General",
    location: "Port Blair, India",
    order_index: 3
  }
];

export const skillsData = [
  {
    category: "Technical Skills",
    items: [
      { name: "Python", icon: "SiPython" },
      { name: "SQL", icon: "SiPostgresql" },
      { name: "R", icon: "SiR" },
      { name: "Data Analysis", icon: "SiGoogleanalytics" }, // Using Analytics icon for general data analysis
      { name: "Data Cleaning", icon: "VscClearAll" }, // Using Clear All icon
      { name: "EDA", icon: "SiGraphql" }, // Using Graph icon
      { name: "Visualization", icon: "SiChartdotjs" }
    ],
    order_index: 1
  },
  {
    category: "Libraries & Statistics", // Combined Libraries and Statistical Skills
    items: [
      { name: "Pandas", icon: "SiPandas" },
      { name: "NumPy", icon: "SiNumpy" },
      { name: "Matplotlib", icon: "SiPlotly" },
      { name: "Seaborn", icon: "SiSeaborn" },
      { name: "Statistics", icon: "SiWolframmathematica" } // Representing Stats
    ],
    order_index: 2
  },
  {
    category: "Tools",
    items: [
      { name: "Excel", icon: "RiFileExcel2Fill" },
      { name: "Power BI", icon: "RiBarChartFill" },
      { name: "Tableau", icon: "SiTableau" },
      { name: "Jupyter", icon: "SiJupyter" }, // Added Jupyter
      { name: "Google Colab", icon: "SiGooglecolab" }, // Added Colab
      { name: "VS Code", icon: "VscVscode" },
      { name: "GitHub", icon: "SiGithub" },
      { name: "Canva", icon: "SiCanva" } // Added Canva
    ],
    order_index: 3
  },
  {
    category: "Soft Skills",
    items: [
      { name: "Problem Solving", icon: "VscCircuitBoard" },
      { name: "Adaptability", icon: "VscSymbolEvent" },
      { name: "Communication", icon: "VscCommentDiscussion" },
      { name: "Attention to Detail", icon: "VscSearch" }
    ],
    order_index: 4
  }
];

export const projectsData = [
  {
    title: "SQL Data Warehouse & ETL Pipeline",
    summary: "Designed a multi-layer Data Warehouse (Bronze, Silver, Gold) and built automated ETL pipelines with Star Schema models.",
    tags: ["SQL Server", "T-SQL", "ETL", "Data Warehousing"],
    image: "/projects/SQL_DW_DASHBOARD.png",
    // live_url: "#",
    // code_url: "#",
    order_index: 1
  },
  {
    title: "Sales Performance & Customer Insights",
    summary: "Analyzed sales trends and customer behavior using SQL/Python, calculating KPIs and building interactive Power BI dashboards.",
    tags: ["SQL", "Python", "Power BI", "Excel"],
    image: "/projects/sales-dashboard.png",
    // live_url: "#",
    // code_url: "#",
    order_index: 2
  },
  {
    title: "HR Analytics Dashboard",
    summary: "Built an interactive Tableau dashboard to track workforce trends with a custom UI designed in Figma.",
    tags: ["Tableau", "Figma", "Data Visualization"],
    // live_url: "#",
    // code_url: "#",
    order_index: 3
  },
  {
    title: "Skin Disease Detection Using ML",
    summary: "Built and deployed a CNN-based model to classify skin diseases from image data using TensorFlow/Keras and Flask.",
    tags: ["Python", "CNN", "TensorFlow", "Flask"],
    image: "/projects/SKIN_DISEASE_DETECTION.png",
    // live_url: "#",
    // code_url: "#",
    order_index: 4
  },
  {
    title: "Sentiment Analysis Using ML",
    summary: "Developed a sentiment analysis model using NLP and scikit-learn to classify text data into positive, negative, and neutral sentiments.",
    tags: ["Python", "NLP", "Scikit-learn", "ML"],
    // live_url: "#",
    // code_url: "#",
    order_index: 5
  }
];

export const certificationsData = [
  {
    name: "Google Data Analytics Professional Certificate",
    provider: "Google",
    year: "2023",
    details: "Comprehensive curriculum covering data cleaning, analysis, and visualization.",
    // link: "/certificates/google-analytics.pdf",
    order_index: 1
  },
  {
    name: "SQL for Data Science",
    provider: "Coursera",
    year: "2022",
    details: "In-depth course on SQL queries, joins, and database management.",
    // link: "https://www.coursera.org/account/accomplishments/verify/YOUR_ID",
    order_index: 2
  },
  {
    name: "Data Science",
    provider: "Wipro Talent Next",
    year: "2025",
    details: "",
    link: "/certificates/wipro-talent-next.pdf" ,
    order_index: 3
  }
];
