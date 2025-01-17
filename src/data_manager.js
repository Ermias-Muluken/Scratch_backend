export class DataManager {
  constructor(core) {
    this.core = core;
    this.dataPoints = new Map();
    this.retentionPeriod = 24 * 60 * 60 * 1000; // 24 hours
  }

  async initialize() {
    console.log('Initializing Data Manager');
    this.startDataCleanup();
  }

  addDataPoint(sourceId, data) {
    const timestamp = Date.now();
    const sourceData = this.dataPoints.get(sourceId) || [];
    
    sourceData.push({
      timestamp,
      ...data
    });

    this.dataPoints.set(sourceId, sourceData);
  }

  getDataPoints(sourceId, startTime, endTime) {
    const sourceData = this.dataPoints.get(sourceId) || [];
    return sourceData.filter(point => 
      point.timestamp >= startTime && point.timestamp <= endTime
    );
  }

  startDataCleanup() {
    setInterval(() => {
      const cutoffTime = Date.now() - this.retentionPeriod;
      
      for (const [sourceId, data] of this.dataPoints.entries()) {
        const filteredData = data.filter(point => point.timestamp >= cutoffTime);
        this.dataPoints.set(sourceId, filteredData);
      }
    }, 60 * 60 * 1000); // Run cleanup every hour
  }

  calculateAverage(sourceId, field, startTime, endTime) {
    const data = this.getDataPoints(sourceId, startTime, endTime);
    if (data.length === 0) return 0;

    const sum = data.reduce((acc, point) => acc + (point[field] || 0), 0);
    return sum / data.length;
  }

  calculateMax(sourceId, field, startTime, endTime) {
    const data = this.getDataPoints(sourceId, startTime, endTime);
    if (data.length === 0) return 0;

    return Math.max(...data.map(point => point[field] || 0));
  }

  calculateMin(sourceId, field, startTime, endTime) {
    const data = this.getDataPoints(sourceId, startTime, endTime);
    if (data.length === 0) return 0;

    return Math.min(...data.map(point => point[field] || 0));
  }
}