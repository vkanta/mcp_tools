-- MariaDB MCP Server - Sample Database Schema and Data
-- This script creates the sample database structure and populates it with test data

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Campaigns table for managing shadow mode campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('draft', 'active', 'completed', 'archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Components table for managing software components
CREATE TABLE IF NOT EXISTS components (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  version VARCHAR(50) NOT NULL,
  description TEXT,
  type ENUM('shadow', 'production', 'test') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for many-to-many relationship between campaigns and components
CREATE TABLE IF NOT EXISTS campaign_components (
  campaign_id INT,
  component_id INT,
  PRIMARY KEY (campaign_id, component_id),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE
);

-- =====================================================
-- 2. INSERT SAMPLE DATA
-- =====================================================

-- Sample campaigns
INSERT IGNORE INTO campaigns (id, name, description, status) VALUES 
(1, 'Shadow Mode Test Campaign', 'Initial test campaign for shadow mode functionality', 'draft'),
(2, 'Production Validation Campaign', 'Validate components in production environment', 'active'),
(3, 'Component Integration Test', 'Test component compatibility and integration', 'completed');

-- Sample components
INSERT IGNORE INTO components (id, name, version, description, type) VALUES 
(1, 'Navigation Component', 'v1.2.3', 'Advanced navigation system component', 'shadow'),
(2, 'Engine Control Unit', 'v2.1.0', 'Main engine control component', 'production'),
(3, 'Safety Monitor', 'v1.0.5', 'Safety monitoring and validation component', 'test'),
(4, 'Sensor Array', 'v3.0.1', 'Comprehensive sensor data collection', 'shadow');

-- Sample campaign-component relationships
INSERT IGNORE INTO campaign_components (campaign_id, component_id) VALUES 
(1, 1), (1, 3),  -- Shadow Mode Test Campaign uses Navigation Component + Safety Monitor
(2, 2), (2, 4),  -- Production Validation Campaign uses Engine Control Unit + Sensor Array
(3, 1), (3, 2), (3, 3);  -- Component Integration Test uses Navigation + Engine + Safety

-- =====================================================
-- 3. VERIFICATION QUERIES
-- =====================================================

-- Show all tables
SELECT 'Tables created:' as info;
SHOW TABLES;

-- Show campaigns
SELECT 'Sample campaigns:' as info;
SELECT id, name, status, created_at FROM campaigns;

-- Show components
SELECT 'Sample components:' as info;
SELECT id, name, version, type FROM components;

-- Show relationships
SELECT 'Campaign-Component relationships:' as info;
SELECT 
  c.name as campaign_name,
  c.status,
  comp.name as component_name,
  comp.version,
  comp.type as component_type
FROM campaigns c
JOIN campaign_components cc ON c.id = cc.campaign_id
JOIN components comp ON cc.component_id = comp.id
ORDER BY c.id, comp.id;

-- Show counts
SELECT 'Data summary:' as info;
SELECT 
  (SELECT COUNT(*) FROM campaigns) as total_campaigns,
  (SELECT COUNT(*) FROM components) as total_components,
  (SELECT COUNT(*) FROM campaign_components) as total_relationships;

SELECT 'Database setup complete!' as status;