const sdk = require('node-appwrite');

module.exports = async function (req, res) {
    const client = new sdk.Client();
    
    const PROJECT_ID = '6a618ce5000f16a35682';
    const DATABASE_ID = '1820143';
    const API_KEY = 'standard_8663a0503511951534e30987afcdb43944d518145a0f297e8671141f2e55ad00be883166dc78585084dc2707b9c72c68e47caf3e9878ce9c5b9fc486ae2cfa020399e3b9beed8a5b568276805471970f77bbb3f15c604a54a8730c7a9ff29544aeecd554bc46c411e6138f6896dccc96471b0273be4468347d4c1a265674a792';
    
    client
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(PROJECT_ID)
        .setKey(API_KEY);

    const database = new sdk.Databases(client);
    
    const fourteenHoursAgo = new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString();

    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            'moments',
            [sdk.Query.lessThan('createdAt', fourteenHoursAgo)]
        );

        let deletedCount = 0;
        for (const doc of result.documents) {
            await database.deleteDocument(DATABASE_ID, 'moments', doc.$id);
            deletedCount++;
        }

        res.json({ success: true, deleted: deletedCount });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
};