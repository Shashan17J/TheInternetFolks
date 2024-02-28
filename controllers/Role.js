const Role = require("../models/Role");

exports.Role = async (req, res) => {
  try {
    const { name } = req.body;

    //   Validation
    if (!name) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    const role = await Role.create({
      name,
    });

    return res.status(200).json({
      success: true,
      content: {
        data: {
          id: role.id,
          name: role.name,
          created_at: role.created_at,
          updated_at: role.updated_at,
        },
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

// GetAll Role Handler
exports.GetRole = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10; // Number of documents per page

  try {
    // Count total documents
    const total = await Role.countDocuments();
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    // Get paginated roles
    const roles = await Role.find()
      .skip((page - 1) * limit)
      .limit(limit);

    // Map roles to the desired format
    const data = roles.map((role) => ({
      id: role.id,
      name: role.name,
      created_at: role.created_at,
      updated_at: role.updated_at,
    }));
    
    // Return paginated roles with metadata
    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total,
          pages: totalPages,
          page,
        },

        data,
      },
    });
  } catch (err) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Can't fetch the roles",
      error: err.message,
    });
  }
};
