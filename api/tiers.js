// Load tiers from a JSON file (or use a database in production)
import fs from 'fs';
import path from 'path';

const tiersFilePath = path.join(process.cwd(), 'data', 'tiers.json');

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Fetch tiers
        try {
            const data = fs.readFileSync(tiersFilePath, 'utf8');
            const tiers = JSON.parse(data);
            res.status(200).json(tiers);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch tiers' });
        }
    } else if (req.method === 'POST') {
        // Save tiers
        try {
            const tiers = req.body;
            fs.writeFileSync(tiersFilePath, JSON.stringify(tiers));
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Failed to save tiers' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
