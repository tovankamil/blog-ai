INSERT INTO admin_users (email, password_hash, display_name)
VALUES
    (
        'admin@local.dev',
        '$2a$10$x1XarjNWYKPgYYhqn.UZy.5hj7JJP2jKDO5a.FCVuahubwdUvJo5m',
        'Local Admin'
    )
ON CONFLICT (email) DO UPDATE
SET
    password_hash = EXCLUDED.password_hash,
    display_name = EXCLUDED.display_name,
    updated_at = NOW();
