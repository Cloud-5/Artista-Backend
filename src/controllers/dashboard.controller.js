const db = require('../utils/database');

class Dashboard {

    static getNumRegisteredCustomers() {
        return db.execute('SELECT COUNT(*) as numRegisteredCustomers FROM user WHERE role = "customer"');
    }

    static getMonthlyRegistrations() {
        return db.execute(`
          SELECT DATE_FORMAT(registered_at, '%Y-%m') AS registrationMonth,
                 COUNT(*) AS registrationsCount
          FROM user
          WHERE registered_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
          GROUP BY registrationMonth;
        `);
    }

    static getNumUploadedCreations() {
        return db.execute('SELECT COUNT(*) AS numUploadedCreations FROM artwork');
    }
    
      static getMonthlyCreations() {
        return db.execute(`
          SELECT DATE_FORMAT(published_date, '%Y-%m') AS publicationMonth,
                 COUNT(*) AS creationsCount
          FROM artwork
          WHERE published_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
          GROUP BY publicationMonth;
        `);
    }

    static getNumApprovedArtists() {
        return db.execute('SELECT COUNT(*) AS numApprovedArtists FROM user WHERE role = "artist" AND is_approved = TRUE');
      }
    
      static getMonthlyApprovals() {
        return db.execute(`
          SELECT DATE_FORMAT(registered_at, '%Y-%m') AS approvalMonth,
                 COUNT(*) AS approvalsCount
          FROM user
          WHERE role = 'artist' AND is_approved = TRUE AND registered_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
          GROUP BY approvalMonth;
        `);
      }

      static getNumRegisteredUsers() {
        return db.execute(`
          SELECT COUNT(*) AS numRegisteredUsers
          FROM user
          WHERE role IN ('customer', 'artist') AND (is_approved = TRUE OR role = 'customer');
        `);
      }

      static getArtCategoryDistribution() {
        return db.execute(`
          SELECT c.name AS categoryName,
                 COUNT(*) AS creationsCount
          FROM artwork a
          JOIN category c ON a.category_id = c.category_id
          GROUP BY categoryName;
        `);
      };

};




exports.getDashboardOverview = async (req, res, next) => {
  try {
    const overviewData = {};

    // Get data for dashboard overview
    overviewData.numRegisteredCustomers = await getNumRegisteredCustomers();
    overviewData.monthlyRegistrations = await getMonthlyRegistrations();
    overviewData.numUploadedCreations = await getNumUploadedCreations();
    overviewData.monthlyCreations = await getMonthlyCreations();
    overviewData.numApprovedArtists = await getNumApprovedArtists();
    overviewData.monthlyApprovals = await getMonthlyApprovals();
    overviewData.artCategoryDistribution = await getArtCategoryDistribution();
    overviewData.numRegisteredUsers = await getNumRegisteredUsers();

    // Send the data in the response
    res.status(200).json(overviewData);
  } catch (error) {
    console.error('Error getting dashboard overview:', error);
    next(error);
  }
};

async function getNumRegisteredCustomers() {
  const result = await Dashboard.getNumRegisteredCustomers();
  return result[0][0].numRegisteredCustomers;
}

async function getMonthlyRegistrations() {
  const result = await Dashboard.getMonthlyRegistrations();
  return result[0];
}

async function getNumUploadedCreations() {
  const result = await Dashboard.getNumUploadedCreations();
  return result[0][0].numUploadedCreations;
}

async function getMonthlyCreations() {
  const result = await Dashboard.getMonthlyCreations();
  return result[0];
}

async function getNumApprovedArtists() {
  const result = await Dashboard.getNumApprovedArtists();
  return result[0][0].numApprovedArtists;
}

async function getMonthlyApprovals() {
  const result = await Dashboard.getMonthlyApprovals();
  return result[0];
}

async function getArtCategoryDistribution() {
  const result = await Dashboard.getArtCategoryDistribution();
  return result[0];
}

async function getNumRegisteredUsers() {
  const result = await Dashboard.getNumRegisteredUsers();
  return result[0][0].numRegisteredUsers;
}
