CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO locations (name, latitude, longitude, description)
VALUES
('Alpha Gate A', 21.4138, 39.8936, 'Entry point for routing'),
('Alpha Station', 21.3556, 39.9842, 'Transit and crowd checkpoint')
ON CONFLICT DO NOTHING;
