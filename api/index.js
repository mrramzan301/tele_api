export default async function handler(req, res) {
  // 1. CORS Headers (Allow all origins & methods)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Preflight OPTIONS request handled
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Query parameter (telegram username) capture karna
  const telegram = req.query.telegram || req.query.username || '';

  if (!telegram) {
    return res.status(400).json({
      Status: false,
      Error: "Telegram username is required. Pass ?telegram=@username or ?telegram=username"
    });
  }

  // Check karna ke username ke aage '@' hai ya nahi (dono cases support honge)
  const formattedTelegram = telegram.startsWith('@') ? telegram : `@${telegram}`;

  try {
    // 3. Original API ko backend se call karna (Browser restriction bypass ho jayegi)
    const targetUrl = `https://techvishalboss.com/api/v1/lookup.php?key=TVB_FULL_E38A6225&service=tg_to_number&telegram=${encodeURIComponent(formattedTelegram)}`;
    
    const response = await fetch(targetUrl);
    const data = await response.json();

    if (data && data.Status) {
      // 4. Old Brand field ko delete karke new custom branding add karna
      delete data.Brand;

      const modifiedData = {
        Status: data.Status,
        Developed_By: "Ramzan Ahsan",
        Whatsapp_Group: "https://chat.whatsapp.com/FiZBn0BykHX47d1iHLOay1",
        Search_Number: data.Search_Number,
        Data: data.Data
      };

      return res.status(200).json(modifiedData);
    } else {
      return res.status(200).json(data);
    }

  } catch (error) {
    return res.status(500).json({
      Status: false,
      Error: "Failed to fetch data from source API",
      Details: error.message
    });
  }
}
