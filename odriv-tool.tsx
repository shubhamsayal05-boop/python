import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Database, BarChart3, Settings, FileText, Trash2, HelpCircle, Layers, Download, X, CheckCircle, AlertCircle } from 'lucide-react';

const ODrivTool = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showModeDialog, setShowModeDialog] = useState(false);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedMode, setSelectedMode] = useState('AUTO');
  
  const [projectData, setProjectData] = useState({
    id: '',
    nameCode: '',
    droopyLine: '',
    mode: '',
    fuel: 'GASOLINE',
    gears: 'AT',
    softwareMilestone: 'SERIE',
    priority: '',
    version: 'V4.6',
    odrivMilestone: '4',
    area: 'North America',
    targetVehicle: 'BMW 225i',
    numberOfGears: '8'
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [calculationComplete, setCalculationComplete] = useState(false);
  const [currentView, setCurrentView] = useState('driveability');
  const [selectedSubMode, setSelectedSubMode] = useState(null);

  // Mock comprehensive data matching the Excel tool
  const [ratingData, setRatingData] = useState({
    overallStatus: '',
    topAreas: [
      'Op mode (criteria)',
      'Op mode (criteria)', 
      'Op mode (criteria)'
    ],
    driveability: {
      currentIndex: 73.78,
      targetIndex: 85.85,
      currentRateOfLowPoints: 1.8,
      targetRateOfLowPoints: 18.25,
      status: 'GREEN'
    },
    dynamism: {
      currentIndex: 74.31,
      targetIndex: 88.92,
      currentRateOfLowPoints: 2.94,
      targetRateOfLowPoints: 6.73,
      status: 'GREEN'
    }
  });

  // Sub-operation modes with detailed data
  const subOperationModes = [
    { 
      name: 'Drive away',
      category: 'Drive away',
      driveIndex: 86.3,
      targetDriveIndex: 85.1,
      dynamicIndex: 73.8,
      targetDynamicIndex: 93.1,
      priorities: { p1: 'green', p2: 'green', p3: 'green' },
      events: [
        { time: '14.46', priority: 1, rating: 'GREEN', criteria: 'Kick', value: 0.42, target: 1.0 },
        { time: '16.23', priority: 2, rating: 'YELLOW', criteria: 'Shock', value: 1.5, target: 1.0 },
        { time: '18.91', priority: 1, rating: 'GREEN', criteria: 'Response Time', value: 0.8, target: 1.2 }
      ],
      statistics: {
        total: 23,
        green: 20,
        yellow: 3,
        red: 0,
        coverage: 87.0
      }
    },
    {
      name: 'Drive Away-Creep Eng On',
      category: 'Drive away', 
      driveIndex: 77.0,
      targetDriveIndex: 85.1,
      dynamicIndex: 100.0,
      targetDynamicIndex: 100.0,
      priorities: { p1: 'green', p2: 'yellow', p3: 'green' },
      events: [
        { time: '12.34', priority: 1, rating: 'GREEN', criteria: 'Acceleration', value: 0.9, target: 1.0 },
        { time: '15.67', priority: 2, rating: 'YELLOW', criteria: 'Jerk', value: 2.1, target: 1.5 }
      ],
      statistics: {
        total: 15,
        green: 12,
        yellow: 3,
        red: 0,
        coverage: 92.0
      }
    },
    {
      name: 'Accelerations',
      category: 'Accelerations',
      driveIndex: 97.4,
      targetDriveIndex: 94.6,
      dynamicIndex: 73.9,
      targetDynamicIndex: null,
      priorities: { p1: 'green', p2: 'green', p3: 'red' },
      events: [
        { time: '22.45', priority: 3, rating: 'RED', criteria: 'Power Delivery', value: 3.2, target: 2.0 },
        { time: '25.78', priority: 1, rating: 'GREEN', criteria: 'Response', value: 0.7, target: 1.0 }
      ],
      statistics: {
        total: 18,
        green: 15,
        yellow: 2,
        red: 1,
        coverage: 94.0
      }
    }
  ];

  const fileInputRef = useRef(null);

  const milestoneOptions = ['Post AMC2', 'Post AMC3', 'SERIE', 'QG2', 'QG3', 'QG4', 'QG5', 'QG6'];
  const engineTypes = ['GASOLINE', 'DIESEL', 'ELEC BEV'];
  const gearboxTypes = ['AT', 'EAT', 'EDCT', 'MANUAL GEARBOX', 'BEV', 'CVT'];
  const areaOptions = ['EUROPE', 'CHINA', 'North America', 'LATAM', 'India', 'World'];
  const targetVehicles = ['BMW 225i', 'BMW 218d', 'AUDI Q5', 'BMW 320i', 'VW eGolf', 'VW Golf GTE', 'BMW 118i', 'VW Id3'];
  const versionOptions = ['V3.8', 'V4.0', 'V4.2', 'V4.6'];

  const handleNewProject = () => {
    setShowProjectDialog(true);
  };

  const handleProjectSubmit = () => {
    const newProject = {
      ...projectData,
      id: Date.now().toString(),
      nameCode: `${projectData.nameCode || '23MY_2.0LT_GU_PS_Vin877'}`
    };
    setProjectData(newProject);
    setShowProjectDialog(false);
    alert('Project successfully registered.');
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
    setShowUploadProgress(true);
    
    // Simulate upload process
    setTimeout(() => {
      setShowModeDialog(true);
      setShowUploadProgress(false);
    }, 2000);
  };

  const handleModeSelection = () => {
    setProjectData(prev => ({ ...prev, mode: selectedMode }));
    setShowModeDialog(false);
    alert('Files uploaded successfully.');
  };

  const handleCalculateRating = () => {
    setShowUploadProgress(true);
    setTimeout(() => {
      setCalculationComplete(true);
      setActiveTab('rating');
      setShowUploadProgress(false);
      alert('Rating calculation completed.');
    }, 3000);
  };

  const renderProjectDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Start a new project...</h3>
          <button onClick={() => setShowProjectDialog(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name/ Code:</label>
            <input 
              type="text"
              value={projectData.nameCode}
              onChange={(e) => setProjectData(prev => ({...prev, nameCode: e.target.value}))}
              className="w-full border rounded px-3 py-1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">ODRIV Milestone :</label>
            <input 
              type="text"
              value={projectData.odrivMilestone}
              onChange={(e) => setProjectData(prev => ({...prev, odrivMilestone: e.target.value}))}
              className="w-full border rounded px-3 py-1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Droopy line:</label>
            <input 
              type="text"
              value={projectData.droopyLine}
              onChange={(e) => setProjectData(prev => ({...prev, droopyLine: e.target.value}))}
              className="w-full border rounded px-3 py-1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Area:</label>
            <select 
              value={projectData.area}
              onChange={(e) => setProjectData(prev => ({...prev, area: e.target.value}))}
              className="w-full border rounded px-3 py-1"
            >
              {areaOptions.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Software Milestone:</label>
            <select 
              value={projectData.softwareMilestone}
              onChange={(e) => setProjectData(prev => ({...prev, softwareMilestone: e.target.value}))}
              className="w-full border rounded px-3 py-1"
            >
              {milestoneOptions.map(milestone => (
                <option key={milestone} value={milestone}>{milestone}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Target vehicle:</label>
            <select 
              value={projectData.targetVehicle}
              onChange={(e) => setProjectData(prev => ({...prev, targetVehicle: e.target.value}))}
              className="w-full border rounded px-3 py-1"
            >
              {targetVehicles.map(vehicle => (
                <option key={vehicle} value={vehicle}>{vehicle}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Engine type :</label>
            <select 
              value={projectData.fuel}
              onChange={(e) => setProjectData(prev => ({...prev, fuel: e.target.value}))}
              className="w-full border rounded px-3 py-1"
            >
              {engineTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Version:</label>
            <select 
              value={projectData.version}
              onChange={(e) => setProjectData(prev => ({...prev, version: e.target.value}))}
              className="w-full border rounded px-3 py-1"
            >
              {versionOptions.map(version => (
                <option key={version} value={version}>{version}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Gearbox type :</label>
            <select 
              value={projectData.gears}
              onChange={(e) => setProjectData(prev => ({...prev, gears: e.target.value}))}
              className="w-full border rounded px-3 py-1"
            >
              {gearboxTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Number Of Gears :</label>
            <select 
              value={projectData.numberOfGears}
              onChange={(e) => setProjectData(prev => ({...prev, numberOfGears: e.target.value}))}
              className="w-full border rounded px-3 py-1"
            >
              {[1,5,6,7,8,9,10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <label className="flex items-center">
            <input type="radio" name="assessment" value="Partiel" className="mr-2" />
            Partiel
          </label>
          <label className="flex items-center">
            <input type="radio" name="assessment" value="Full" defaultChecked className="mr-2" />
            Full
          </label>
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          <button 
            onClick={() => setShowProjectDialog(false)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Cancel
          </button>
          <button 
            onClick={handleProjectSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );

  const renderModeDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4 text-center bg-teal-800 text-white p-2">Mode</h3>
        <div className="space-y-2">
          {['AUTO', 'ECO', 'SPORT', 'MANUAL'].map(mode => (
            <label key={mode} className="flex items-center">
              <input 
                type="radio" 
                name="mode" 
                value={mode}
                checked={selectedMode === mode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="mr-2" 
              />
              {mode}
            </label>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <button 
            onClick={handleModeSelection}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );

  const renderProgressDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg text-center">
        <div className="mb-4">
          <div className="w-32 h-32 mx-auto bg-yellow-400 rounded-full flex items-center justify-center">
            <Settings className="w-16 h-16 text-white animate-spin" />
          </div>
        </div>
        <div className="text-lg font-semibold">WORK IN PROGRESS</div>
        <div className="text-sm text-gray-600 mt-2">Verification des donnees</div>
      </div>
    </div>
  );

  const renderProjectSettings = () => (
    <div className="bg-gray-100 p-4 rounded">
      <h3 className="font-bold mb-4 text-blue-900 bg-gray-300 p-2">PROJECT SETTINGS</h3>
      <div className="grid grid-cols-2 gap-1 text-xs">
        <div className="bg-white p-2 border font-bold">ID</div>
        <div className="bg-white p-2 border">{projectData.id}</div>
        <div className="bg-white p-2 border font-bold">NAME / CODE</div>
        <div className="bg-white p-2 border">{projectData.nameCode}</div>
        <div className="bg-white p-2 border font-bold">MODE</div>
        <div className="bg-white p-2 border font-bold">FUEL</div>
        <div className="bg-white p-2 border">{projectData.mode}</div>
        <div className="bg-white p-2 border">{projectData.fuel}</div>
        <div className="bg-white p-2 border font-bold">GEARS</div>
        <div className="bg-white p-2 border font-bold">SOFTWARE MILESTONE</div>
        <div className="bg-white p-2 border">{projectData.gears}</div>
        <div className="bg-white p-2 border">{projectData.softwareMilestone}</div>
        <div className="bg-white p-2 border font-bold">PRIORITY</div>
        <div className="bg-white p-2 border font-bold">VERSION</div>
        <div className="bg-white p-2 border">{projectData.priority}</div>
        <div className="bg-white p-2 border">{projectData.version}</div>
        <div className="bg-white p-2 border font-bold">ODRIV MILESTONE</div>
        <div className="bg-white p-2 border font-bold">AREA</div>
        <div className="bg-white p-2 border">{projectData.odrivMilestone}</div>
        <div className="bg-white p-2 border">{projectData.area}</div>
        <div className="bg-white p-2 border font-bold">TARGET VEHICLE</div>
        <div className="bg-white p-2 border font-bold">NUMBER OF GEARS</div>
        <div className="bg-white p-2 border">{projectData.targetVehicle}</div>
        <div className="bg-white p-2 border">{projectData.numberOfGears}</div>
      </div>
    </div>
  );

  const renderMainButtons = () => (
    <div className="grid grid-cols-3 gap-4 max-w-4xl">
      <button 
        onClick={handleNewProject}
        className="bg-green-500 text-white p-8 rounded-lg flex flex-col items-center justify-center hover:bg-green-600 transition-colors"
      >
        <Play className="w-12 h-12 mb-2" />
        <span className="font-bold">NEW PROJECT</span>
      </button>
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="bg-yellow-500 text-white p-8 rounded-lg flex flex-col items-center justify-center hover:bg-yellow-600 transition-colors"
      >
        <Upload className="w-12 h-12 mb-2" />
        <span className="font-bold text-center">ADD FILE TO<br/>DATABASE</span>
      </button>
      
      <button 
        onClick={handleCalculateRating}
        className="bg-blue-700 text-white p-8 rounded-lg flex flex-col items-center justify-center hover:bg-blue-800 transition-colors"
      >
        <BarChart3 className="w-12 h-12 mb-2" />
        <span className="font-bold text-center">CALCULATE<br/>RATING</span>
      </button>

      <button 
        onClick={() => setActiveTab('database')}
        className="bg-purple-700 text-white p-8 rounded-lg flex flex-col items-center justify-center hover:bg-purple-800 transition-colors"
      >
        <Database className="w-12 h-12 mb-2" />
        <span className="font-bold text-center">OPEN<br/>DATABASE</span>
      </button>
      
      <button 
        onClick={() => setShowReportDialog(true)}
        className="bg-orange-600 text-white p-8 rounded-lg flex flex-col items-center justify-center hover:bg-orange-700 transition-colors"
      >
        <FileText className="w-12 h-12 mb-2" />
        <span className="font-bold text-center">CREATE<br/>REPORT</span>
      </button>
      
      <button className="bg-gray-600 text-white p-8 rounded-lg flex flex-col items-center justify-center hover:bg-gray-700 transition-colors">
        <Settings className="w-12 h-12 mb-2" />
        <span className="font-bold">SETTINGS</span>
      </button>

      <div className="bg-gray-500 text-white p-8 rounded-lg flex flex-col items-center justify-center">
        <Settings className="w-12 h-12 mb-2" />
        <span className="font-bold text-center">CONFIGURATION<br/>SHEET</span>
      </div>
      
      <button className="bg-yellow-700 text-white p-8 rounded-lg flex flex-col items-center justify-center hover:bg-yellow-800 transition-colors">
        <Layers className="w-12 h-12 mb-2" />
        <span className="font-bold">VERSIONS</span>
      </button>
      
      <button className="bg-yellow-600 text-white p-8 rounded-lg flex flex-col items-center justify-center hover:bg-yellow-700 transition-colors">
        <Upload className="w-12 h-12 mb-2" />
        <span className="font-bold text-center">ADD FILE<br/>(SUBJECTIVE)</span>
      </button>

      <div></div>
      
      <button className="bg-purple-600 text-white p-8 rounded-lg flex flex-col items-center justify-center hover:bg-purple-700 transition-colors">
        <HelpCircle className="w-12 h-12 mb-2" />
        <span className="font-bold">HELP</span>
      </button>
      
      <button className="bg-red-600 text-white p-8 rounded-lg flex flex-col items-center justify-center hover:bg-red-700 transition-colors">
        <Trash2 className="w-12 h-12 mb-2" />
        <span className="font-bold text-center">ERASE<br/>ALL DATA</span>
      </button>
    </div>
  );

  const renderColorBar = (value, target, type = 'index') => {
    let percentage;
    if (type === 'index') {
      percentage = Math.min(100, Math.max(0, value));
    } else {
      percentage = Math.min(100, Math.max(0, 100 - (value * 10)));
    }
    
    let color = 'bg-red-500';
    if (type === 'index') {
      if (value >= 71) color = 'bg-green-500';
      else if (value >= 55) color = 'bg-yellow-500';
    } else {
      if (value <= 3) color = 'bg-green-500';
      else if (value <= 9) color = 'bg-yellow-500';
    }

    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm font-bold min-w-24">{type === 'index' ? 'Index' : 'Rate of low points'}</div>
        <div className="w-64 h-6 bg-gray-200 rounded relative border">
          <div className="absolute left-0 top-0 w-1/3 h-full bg-red-400"></div>
          <div className="absolute left-1/3 top-0 w-1/3 h-full bg-yellow-400"></div>
          <div className="absolute right-0 top-0 w-1/3 h-full bg-green-400"></div>
          <div 
            className="absolute top-0 w-1 h-full bg-black z-10"
            style={{ left: `${percentage * 0.64}px` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
            {type === 'index' ? '55%' : '9%'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {type === 'index' ? '71%' : '3%'}
          </div>
        </div>
        <div className="flex space-x-8 text-sm">
          <div className="text-center">
            <div className="font-bold text-xs">Tested vehicle</div>
            <div className="font-bold">{value.toFixed(1)}{type === 'rate' ? '%' : ''}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xs">Target vehicle</div>
            <div className="font-bold">{target.toFixed(1)}{type === 'rate' ? '%' : ''}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderPriorityDots = (priorities) => (
    <div className="flex space-x-1">
      {[1,2,3,1,2,3].map((p, i) => {
        let color = 'bg-green-500';
        if (i < 3 && priorities.p1 === 'red') color = 'bg-red-500';
        else if (i < 3 && priorities.p1 === 'yellow') color = 'bg-yellow-500';
        else if (i >= 3 && priorities.p2 === 'red') color = 'bg-red-500';
        else if (i >= 3 && priorities.p2 === 'yellow') color = 'bg-yellow-500';
        
        return <div key={i} className={`w-3 h-3 ${color} rounded-full border border-gray-300`}></div>;
      })}
    </div>
  );

  const renderRatingTab = () => (
    <div className="p-4 space-y-6 max-w-full overflow-x-auto">
      <div className="bg-blue-800 text-white text-center text-xl font-bold p-3">
        DRIVABILITY & DYNAMISM ASSESSMENT
      </div>
      
      <div className="bg-gray-100 p-4">
        <div className="text-sm mb-2">
          <strong>Application:</strong> 23MY_2.0LT_GU_PS_Vin877_082321_Medium
        </div>
        <div className="text-sm mb-4">
          <strong>Stage:</strong> QG6
        </div>
        
        <div className="bg-blue-900 text-white p-2 mb-2 font-bold">
          OVERALL STATUS
        </div>
        
        <div className="mb-4">
          <strong>Top Areas of Improvement:</strong>
          <ol className="list-decimal list-inside ml-4 text-sm">
            {ratingData.topAreas.map((area, i) => (
              <li key={i}>{area}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className={`${ratingData.driveability.status === 'GREEN' ? 'bg-green-600' : ratingData.driveability.status === 'YELLOW' ? 'bg-yellow-600' : 'bg-red-600'} text-white p-3 w-32 text-center font-bold text-sm`}>
            DRIVEABILITY<br/>{ratingData.driveability.status}
          </div>
          <div className="space-y-3 flex-1">
            {renderColorBar(ratingData.driveability.currentIndex, ratingData.driveability.targetIndex, 'index')}
            {renderColorBar(ratingData.driveability.currentRateOfLowPoints, ratingData.driveability.targetRateOfLowPoints, 'rate')}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className={`${ratingData.dynamism.status === 'GREEN' ? 'bg-green-600' : ratingData.dynamism.status === 'YELLOW' ? 'bg-yellow-600' : 'bg-red-600'} text-white p-3 w-32 text-center font-bold text-sm`}>
            DYNAMISM<br/>{ratingData.dynamism.status}
          </div>
          <div className="space-y-3 flex-1">
            {renderColorBar(ratingData.dynamism.currentIndex, ratingData.dynamism.targetIndex, 'index')}
            {renderColorBar(ratingData.dynamism.currentRateOfLowPoints, ratingData.dynamism.targetRateOfLowPoints, 'rate')}
          </div>
        </div>
      </div>

      <div className="bg-blue-700 text-white p-2">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold">
          <div>USE CASE</div>
          <div>Current Status<br/>SOPM<br/>Driveability Index<br/>P1 P2 P3 P1 P2 P3</div>
          <div>Driveability<br/>Index</div>
          <div>Target Goal<br/>Index</div>
          <div>Current Status<br/>Driveability Lowest Events<br/>P1 P2 P3 P1 P2 P3</div>
          <div>Dynamism<br/>Index</div>
          <div>Dynamism Lowest Events</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse border border-gray-300">
          <tbody>
            {subOperationModes.map((mode, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedSubMode(mode)}>
                <td className="border border-gray-300 p-2 font-semibold bg-gray-100">{mode.name}</td>
                <td className="border border-gray-300 p-1">
                  {renderPriorityDots(mode.priorities)}
                </td>
                <td className="border border-gray-300 p-2 text-center font-bold">{mode.driveIndex}</td>
                <td className="border border-gray-300 p-2 text-center">{mode.targetDriveIndex}</td>
                <td className="border border-gray-300 p-1">
                  {renderPriorityDots(mode.priorities)}
                </td>
                <td className="border border-gray-300 p-2 text-center font-bold">{mode.dynamicIndex || '—'}</td>
                <td className="border border-gray-300 p-2 text-center">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-700 text-white p-2 text-center">
        <button className="bg-blue-900 px-4 py-2 rounded hover:bg-blue-800">SET AS TARGET</button>
      </div>
    </div>
  );

  const renderSubOperationModeDetail = () => {
    if (!selectedSubMode) return null;

    return (
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold bg-teal-700 text-white p-2">{selectedSubMode.name}</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentView('driveability')}
              className={`px-4 py-2 rounded ${currentView === 'driveability' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
            >
              DRIVEABILITY
            </button>
            <button 
              onClick={() => setCurrentView('dynamism')}
              className={`px-4 py-2 rounded ${currentView === 'dynamism' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
            >
              DYNAMISM
            </button>
          </div>
          <button onClick={() => setSelectedSubMode(null)} className="text-2xl font-bold">×</button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Statistics Panel */}
          <div className="bg-gray-100 p-4 rounded">
            <div className="bg-yellow-500 text-white p-2 text-center font-bold mb-4">YELLOW</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                  P1
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                  P2
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                  P3
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="bg-green-600 h-8 flex items-center justify-center text-white font-bold">TOTAL</div>
              <table className="w-full text-xs mt-2 border-collapse">
                <tbody>
                  <tr>
                    <td className="border p-1">TOTAL</td>
                    <td className="border p-1 bg-blue-200">{selectedSubMode.statistics.total}</td>
                    <td className="border p-1">{selectedSubMode.statistics.total}</td>
                    <td className="border p-1">100.0</td>
                  </tr>
                  <tr>
                    <td className="border p-1 bg-green-200">Green</td>
                    <td className="border p-1">{selectedSubMode.statistics.green}</td>
                    <td className="border p-1">{selectedSubMode.statistics.green}</td>
                    <td className="border p-1">{((selectedSubMode.statistics.green / selectedSubMode.statistics.total) * 100).toFixed(1)}</td>
                  </tr>
                  <tr>
                    <td className="border p-1 bg-yellow-200">Yellow</td>
                    <td className="border p-1">{selectedSubMode.statistics.yellow}</td>
                    <td className="border p-1">{selectedSubMode.statistics.yellow}</td>
                    <td className="border p-1">{((selectedSubMode.statistics.yellow / selectedSubMode.statistics.total) * 100).toFixed(1)}</td>
                  </tr>
                  <tr>
                    <td className="border p-1 bg-red-200">Red</td>
                    <td className="border p-1">{selectedSubMode.statistics.red}</td>
                    <td className="border p-1">{selectedSubMode.statistics.red}</td>
                    <td className="border p-1">{((selectedSubMode.statistics.red / selectedSubMode.statistics.total) * 100).toFixed(1)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-2 text-xs">
                <strong>Coverage rate achieved:</strong> {selectedSubMode.statistics.coverage}%
              </div>
            </div>
          </div>

          {/* Criteria Table */}
          <div className="col-span-2">
            <div className="bg-blue-800 text-white p-2 grid grid-cols-8 gap-2 text-xs font-bold">
              <div>Waterline</div>
              <div>0.2</div>
              <div>0.7</div>
              <div>1.4</div>
              <div>1.8</div>
              <div>1.8</div>
              <div>1.8</div>
              <div>1.8</div>
              <div>Target</div>
              <div>0.1</div>
              <div>0.5</div>
              <div>1.0</div>
              <div>1.5</div>
              <div>1.5</div>
              <div>1.5</div>
              <div>1.5</div>
              <div>Criticity</div>
              <div>2</div>
              <div>2</div>
              <div>2</div>
              <div>2</div>
              <div>1</div>
              <div>2</div>
              <div>2</div>
            </div>
            
            <div className="overflow-auto max-h-96">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-1">Aniticipat.</th>
                    <th className="border p-1">Event Priority</th>
                    <th className="border p-1">Event Rating</th>
                    <th className="border p-1">Base</th>
                    <th className="border p-1">Throttle Position</th>
                    <th className="border p-1">Engine Speed</th>
                    <th className="border p-1">Vehicle Speed</th>
                    <th className="border p-1">Acquisition Time</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSubMode.events.map((event, i) => (
                    <tr key={i} className={`${event.rating === 'GREEN' ? 'bg-green-100' : event.rating === 'YELLOW' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                      <td className="border p-1 text-center">{event.rating === 'GREEN' ? '●' : event.rating === 'YELLOW' ? '●' : '●'}</td>
                      <td className="border p-1 text-center">{event.priority}</td>
                      <td className="border p-1 text-center font-bold">{event.rating}</td>
                      <td className="border p-1">{event.criteria}</td>
                      <td className="border p-1">{Math.random().toFixed(1)}</td>
                      <td className="border p-1">{(Math.random() * 3000 + 1000).toFixed(0)}</td>
                      <td className="border p-1">{(Math.random() * 100 + 20).toFixed(0)}</td>
                      <td className="border p-1">{event.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="bg-gray-100 p-4">
          <h3 className="font-bold mb-2">Throttle Position | Population : Throttle Position / Vehicle Speed</h3>
          <div className="h-64 bg-white border flex items-center justify-center">
            <div className="text-gray-500">Chart visualization would appear here</div>
          </div>
        </div>
      </div>
    );
  };

  const renderDatabaseTab = () => (
    <div className="p-4">
      <div className="bg-blue-900 text-white p-2 mb-4">
        <h2 className="text-xl font-bold text-center">All Projects</h2>
      </div>
      
      <div className="bg-gray-100 p-4">
        <div className="mb-4">
          <strong>Selection :</strong>
        </div>
        
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">DROOPY</th>
              <th className="border border-gray-300 p-2">NAME / CODE</th>
              <th className="border border-gray-300 p-2">GEAR</th>
              <th className="border border-gray-300 p-2">ENERGY</th>
              <th className="border border-gray-300 p-2">PRIORITY</th>
              <th className="border border-gray-300 p-2">ODRIV MILESTONE</th>
              <th className="border border-gray-300 p-2">AREA</th>
              <th className="border border-gray-300 p-2">TARGET</th>
              <th className="border border-gray-300 p-2">SOF</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-blue-100 cursor-pointer">
              <td className="border border-gray-300 p-2">94</td>
              <td className="border border-gray-300 p-2">Training1</td>
              <td className="border border-gray-300 p-2">Training_3.2_AT</td>
              <td className="border border-gray-300 p-2">AT</td>
              <td className="border border-gray-300 p-2">GASOLINE</td>
              <td className="border border-gray-300 p-2">DRIVABILITY</td>
              <td className="border border-gray-300 p-2">4</td>
              <td className="border border-gray-300 p-2">North America</td>
              <td className="border border-gray-300 p-2">PREMIUM</td>
              <td className="border border-gray-300 p-2">SER</td>
            </tr>
            {projectData.id && (
              <tr className="hover:bg-blue-100 cursor-pointer bg-yellow-50">
                <td className="border border-gray-300 p-2">{projectData.id}</td>
                <td className="border border-gray-300 p-2">{projectData.droopyLine}</td>
                <td className="border border-gray-300 p-2">{projectData.nameCode}</td>
                <td className="border border-gray-300 p-2">{projectData.gears}</td>
                <td className="border border-gray-300 p-2">{projectData.fuel}</td>
                <td className="border border-gray-300 p-2">DRIVABILITY</td>
                <td className="border border-gray-300 p-2">{projectData.odrivMilestone}</td>
                <td className="border border-gray-300 p-2">{projectData.area}</td>
                <td className="border border-gray-300 p-2">{projectData.targetVehicle}</td>
                <td className="border border-gray-300 p-2">SER</td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="mt-4 flex justify-between">
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">DELETE</button>
          <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">NEXT</button>
        </div>
      </div>
    </div>
  );

  const renderReportDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Generate Report</h3>
          <button onClick={() => setShowReportDialog(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Document name</th>
                <th className="border border-gray-300 p-2">DocInfo link</th>
                <th className="border border-gray-300 p-2">DocInfo/Sharepoint version</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Self-learning tool</td>
                <td className="border border-gray-300 p-2 text-blue-600 underline">http://docinfogroupe.inetpsa.com/ead/doc/ref.01471_17_01042/v.vc/fiche</td>
                <td className="border border-gray-300 p-2">V17.0</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Event collector</td>
                <td className="border border-gray-300 p-2 text-blue-600 underline">http://docinfogroupe.inetpsa.com/ead/doc/ref.01470_16_00083/v.vc/fiche</td>
                <td className="border border-gray-300 p-2">V10.0</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Objective evaluation</td>
                <td className="border border-gray-300 p-2 text-blue-600 underline">http://docinfogroupe.inetpsa.com/ead/doc/ref.01470_15_00987/v.vc/fiche</td>
                <td className="border border-gray-300 p-2">V7.0</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Experiment</td>
                <td className="border border-gray-300 p-2 text-blue-600 underline">http://docinfogroupe.inetpsa.com/ead/doc/ref.01472_17_03797/v.vc/fiche</td>
                <td className="border border-gray-300 p-2">V57.0</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">ODRIV</td>
                <td className="border border-gray-300 p-2 text-blue-600 underline">http://docinfogroupe.inetpsa.com/ead/doc/ref.01470_16_00345/v.vc/fiche</td>
                <td className="border border-gray-300 p-2">VERSION 27- beta_gallmg...</td>
              </tr>
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium mb-1">Project</label>
              <input type="text" value="2.0LT_GU_PS_Vin877_082321_Medium" className="w-full border rounded px-3 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Domain</label>
              <input type="text" value="DRIVABILITY" className="w-full border rounded px-3 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stage</label>
              <input type="text" value="Production" className="w-full border rounded px-3 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Standard</label>
              <input type="text" value="Euro 6d" className="w-full border rounded px-3 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Goal</label>
              <input type="text" value="/" className="w-full border rounded px-3 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Site</label>
              <input type="text" value="/" className="w-full border rounded px-3 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Car Number</label>
              <input type="text" value="Vin877" className="w-full border rounded px-3 py-1" />
            </div>
            <div></div>
            <div>
              <label className="block text-sm font-medium mb-1">Location and date of test</label>
              <input type="text" value="Dudenhofen August 2021" className="w-full border rounded px-3 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Climate condition</label>
              <input type="text" value="dry" className="w-full border rounded px-3 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">A/C status</label>
              <input type="text" value="on" className="w-full border rounded px-3 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vehicle options</label>
              <input type="text" value="/" className="w-full border rounded px-3 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Initials</label>
              <select className="w-full border rounded px-3 py-1">
                <option>EB</option>
              </select>
            </div>
            <div></div>
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <input type="text" value="Erich BERTLEFF" className="w-full border rounded px-3 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telephone</label>
              <input type="text" value="(+)49614274597O" className="w-full border rounded px-3 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="text" value="erich.bertleff@stellantis.com" className="w-full border rounded px-3 py-1" />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          <button 
            onClick={() => setShowReportDialog(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              setShowReportDialog(false);
              alert('Report generated successfully!');
            }}
            className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-white font-bold">STELLANTIS</div>
            <h1 className="text-2xl font-bold">oDRIV</h1>
            <span className="text-sm">VERSION 27</span>
          </div>
        </div>
      </header>

      <div className="flex">
        <div className="w-1/4 p-4">
          {renderProjectSettings()}
        </div>

        <div className="flex-1 p-4">
          {activeTab === 'home' && (
            <div className="space-y-6">
              <div className="bg-gray-200 p-4 text-center">
                <h2 className="text-xl font-bold mb-2">Add File to Database</h2>
                {renderMainButtons()}
              </div>
            </div>
          )}

          {activeTab === 'rating' && !selectedSubMode && renderRatingTab()}
          {activeTab === 'rating' && selectedSubMode && renderSubOperationModeDetail()}
          {activeTab === 'database' && renderDatabaseTab()}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        accept=".xlsx,.csv,.json"
        className="hidden"
      />

      <div className="bg-gray-800 text-green-400 p-2 text-xs font-mono">
        HOME | RATING | CFG | SDV MANAGER | VERSIONS | Adrien temp testing | 2341 Aborts | Erec Load Decrease | Accel Load Increase | Vehicle Noise | Speed Trans to Cst Speed | Silent without Brk
      </div>

      {showProjectDialog && renderProjectDialog()}
      {showModeDialog && renderModeDialog()}
      {showUploadProgress && renderProgressDialog()}
      {showReportDialog && renderReportDialog()}
    </div>
  );