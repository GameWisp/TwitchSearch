CREATE OR REPLACE VIEW Search_view AS
	SELECT s.*, TIMESTAMPDIFF(HOUR, Created_at, NOW()) as 'Uptime', TIMESTAMPDIFF(MONTH, Channel_created_at, NOW()) as 'Channel_months', l.Language
    FROM Stream s, Language l 
    WHERE s.LanguageID = l.ID;
	
CREATE OR REPLACE VIEW Games_list_view AS
	SELECT DISTINCT Game 
	FROM Stream 
	WHERE Game IS NOT NULL 
	ORDER BY Game ASC;