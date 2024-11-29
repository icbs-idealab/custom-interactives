import { useState } from 'react';
import { Globe2, Flag, Users, BookOpen, Users2, CircleEqual, AlertCircle, PersonStanding, ClipboardList, GraduationCap, Target, BarChart3, MoveUp, Leaf, ListChecks, Quote } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Treemap } from 'recharts';

const StatsCard = ({ icon: Icon, number, text, color }) => (
  <div className={`p-6 flex flex-col items-center justify-center text-center space-y-3 w-72 h-60 rounded-2xl border ${color} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}>
    <div className="rounded-full bg-white/90 p-4 shadow-sm">
      <Icon className="w-8 h-8" />
    </div>
    <span className="text-5xl font-bold mt-2">{number}</span>
    <p className="text-sm font-medium px-2 leading-snug opacity-90">{text}</p>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-2xl transition-all duration-300 ${
      active
        ? 'bg-yellow-400 text-gray-700 shadow-sm hover:bg-yellow-300'
        : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-600'
    } transform hover:-translate-y-0.5`}
  >
    {children}
  </button>
);

const SimplifiedTreemap = ({ northPercentage }) => {
  const southPercentage = 100 - northPercentage;

  const distributionData = [
    {
      percentage: northPercentage,
      label: "Global North",
      description: "(% of countries represented from the Global North)",
      color: "bg-yellow-400 hover:bg-yellow-300",
      textColor: "text-gray-700",
      roundedSide: "rounded-2xl md:rounded-2xl md:rounded-r-none"
    },
    {
      percentage: southPercentage,
      label: "Global South",
      description: "(% of countries represented from the Global South)",
      color: "bg-yellow-400 hover:bg-yellow-300",
      textColor: "text-gray-700",
      roundedSide: "rounded-2xl md:rounded-2xl md:rounded-l-none"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="flex flex-col md:flex-row md:items-stretch">
        {distributionData.map((region, index) => (
          <div
            key={index}
            className="flex-1 transition-all duration-300"
            style={{
              flexGrow: index === 0 ? northPercentage : southPercentage
            }}
          >
            <div className={`${region.color} p-6 ${region.roundedSide} flex flex-col justify-between h-full transition-all duration-300 hover:shadow-lg`}>
              <div>
                <span className={`text-4xl font-bold ${region.textColor}`}>{region.percentage}%</span>
                <h3 className={`text-xl font-semibold ${region.textColor} mt-2`}>{region.label}</h3>
              </div>
              <p className={`text-sm ${region.textColor} mt-4 break-words opacity-90`}>
                {region.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RepresentationTab = () => {
  const stats = [
    {
      icon: Globe2,
      number: "13",
      text: "countries are represented in this module",
      color: "bg-white text-gray-800 border-gray-200"
    },
    {
      icon: Flag,
      number: "United States",
      text: "is the country with the highest representation (37 references)",
      color: "bg-white text-gray-800 border-gray-200"
    },
    {
      icon: Users,
      number: "45%",
      text: "of people referred to whose ethnicity is identifiable are caucasian",
      color: "bg-white text-gray-800 border-gray-200"
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            icon={stat.icon}
            number={stat.number}
            text={stat.text}
            color={stat.color}
          />
        ))}
      </div>
      <SimplifiedTreemap northPercentage={80} />
    </div>
  );
};

const EDITab = () => {
  const stats = [
    {
      icon: CircleEqual,
      number: "4",
      text: "possible instances of gendered language identified",
      color: "bg-white text-gray-800 border-gray-200"
    },
    {
      icon: Users2,
      number: "40%",
      text: "of images with people show diverse representation",
      color: "bg-white text-gray-800 border-gray-200"
    },
    {
      icon: BookOpen,
      number: "68%",
      text: "of discipline-specific terms used are explained",
      color: "bg-white text-gray-800 border-gray-200"
    },
    {
      icon: AlertCircle,
      number: "2",
      text: "possible instances of stereotypes or generalizations found",
      color: "bg-white text-gray-800 border-gray-200"
    },
    {
      icon: PersonStanding,
      number: "3",
      text: "possible acknowledgements of EDI themes",
      color: "bg-white text-gray-800 border-gray-200"
    },
    {
      icon: Quote,
      number: "5",
      text: "possible cultural references identified",
      color: "bg-white text-gray-800 border-gray-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          icon={stat.icon}
          number={stat.number}
          text={stat.text}
          color={stat.color}
        />
      ))}
    </div>
  );
};
const AssessmentPieChart = () => {
    const data = [
      { name: 'Participation', value: 1 },
      { name: 'Report', value: 1 },
      { name: 'Presentation', value: 1 }
    ];
  
    const COLORS = ['#facc15', '#fbbf24', '#f59e0b'];
  
    return (
      <div className="w-full max-w-6xl mx-auto mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Distribution of Assessment Types</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  const AssessmentTab = () => {
    const stats = [
      {
        icon: ClipboardList,
        number: "3",
        text: "types of assessment included",
        color: "bg-white text-gray-800 border-gray-200"
      },
      {
        icon: GraduationCap,
        number: "2",
        text: "assessments align with one or more module learning outcomes",
        color: "bg-white text-gray-800 border-gray-200"
      },
      {
        icon: Target,
        number: "3/5",
        text: "module learning outcomes are effective",
        color: "bg-white text-gray-800 border-gray-200"
      },
      {
        icon: ListChecks,
        number: "0/2",
        text: "of uploaded assessments have clear marking criteria or rubrics",
        color: "bg-white text-gray-800 border-gray-200"
      }
    ];
  
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              icon={stat.icon}
              number={stat.number}
              text={stat.text}
              color={stat.color}
            />
          ))}
        </div>
        <AssessmentPieChart />
      </div>
    );
  };
  
  const SDGTreemap = () => {
    const data = [
      {
        name: 'SDG 1: No Poverty',
        shortName: 'SDG 1',
        size: 12,
        fill: '#facc15',
      },
      {
        name: 'SDG 2: Zero Hunger',
        shortName: 'SDG 2',
        size: 15,
        fill: '#fbbf24',
      },
      {
        name: 'SDG 6: Clean Water',
        shortName: 'SDG 6',
        size: 15,
        fill: '#f59e0b',
      },
      {
        name: 'SDG 8: Decent Work',
        shortName: 'SDG 8',
        size: 28,
        fill: '#facc15',
      },
      {
        name: 'SDG 9: Industry Innovation',
        shortName: 'SDG 9',
        size: 25,
        fill: '#fbbf24',
      },
      {
        name: 'SDG 10: Reduced Inequalities',
        shortName: 'SDG 10',
        size: 20,
        fill: '#f59e0b',
      },
      {
        name: 'SDG 11: Sustainable Cities',
        shortName: 'SDG 11',
        size: 16,
        fill: '#facc15',
      },
      {
        name: 'SDG 13: Climate Action',
        shortName: 'SDG 13',
        size: 22,
        fill: '#fbbf24',
      },
      {
        name: 'SDG 14: Life Below Water',
        shortName: 'SDG 14',
        size: 12,
        fill: '#f59e0b',
      },
      {
        name: 'SDG 15: Life on Land',
        shortName: 'SDG 15',
        size: 14,
        fill: '#facc15',
      },
      {
        name: 'SDG 16: Peace & Justice',
        shortName: 'SDG 16',
        size: 15,
        fill: '#fbbf24',
      },
      {
        name: 'SDG 17: Partnerships',
        shortName: 'SDG 17',
        size: 22,
        fill: '#f59e0b',
      }
    ];
  
    const CustomizedContent = (props) => {
      const { x, y, width, height, shortName, fill } = props;
  
      return (
        <g>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
              fill,
              stroke: '#fff',
              strokeWidth: 2,
              strokeOpacity: 1,
            }}
          />
          {width > 30 && height > 30 && (
            <text
              x={x + width / 2}
              y={y + height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#1f2937"
              fontSize={14}
              fontWeight="bold"
              style={{ pointerEvents: 'none' }}
            >
              {shortName}
            </text>
          )}
        </g>
      );
    };
  
    return (
      <div className="w-full max-w-6xl mx-auto mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">SDG Coverage Distribution</h3>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={data}
              dataKey="size"
              aspectRatio={4/3}
              stroke="#fff"
              content={<CustomizedContent />}
            >
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-200">
                        <p className="text-sm font-semibold text-gray-800">{data.name}</p>
                        <p className="text-sm text-gray-600">{data.size} references</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  const SDGTab = () => {
    const stats = [
      {
        icon: BarChart3,
        number: "8/17",
        text: "SDGs are addressed by the content",
        color: "bg-white text-gray-800 border-gray-200"
      },
      {
        icon: MoveUp,
        number: "SDG 8",
        text: "Decent Work and Economic Growth is the most prominent SDG theme",
        color: "bg-white text-gray-800 border-gray-200"
      },
      {
        icon: Leaf,
        number: "4",
        text: "references to climate-related themes and actions",
        color: "bg-white text-gray-800 border-gray-200"
      }
    ];
  
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              icon={stat.icon}
              number={stat.number}
              text={stat.text}
              color={stat.color}
            />
          ))}
        </div>
        <SDGTreemap />
      </div>
    );
  };
  
  const RepresentationDashboard = () => {
    const [activeTab, setActiveTab] = useState('representation');
  
    return (
      <div className="w-full mx-auto p-4 sm:p-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            Module Analysis Dashboard ✨
          </h1>
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-wrap gap-3 justify-center">
                <TabButton 
                  active={activeTab === 'representation'} 
                  onClick={() => setActiveTab('representation')}
                >
                  Representation
                </TabButton>
                <TabButton 
                  active={activeTab === 'edi'} 
                  onClick={() => setActiveTab('edi')}
                >
                  EDI
                </TabButton>
                <TabButton 
                  active={activeTab === 'assessment'} 
                  onClick={() => setActiveTab('assessment')}
                >
                  Assessment
                </TabButton>
                <TabButton 
                  active={activeTab === 'sdg'} 
                  onClick={() => setActiveTab('sdg')}
                >
                  SDGs
                </TabButton>
              </div>
            </div>
  
            <div className="p-6">
              {activeTab === 'representation' ? <RepresentationTab /> : 
               activeTab === 'edi' ? <EDITab /> : 
               activeTab === 'assessment' ? <AssessmentTab /> : <SDGTab />}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default RepresentationDashboard;