import Project from "../projects/projectsModel.js";
import Category from "../categories/categoriesModel.js";

// ─────────────────────────────────────────
// @desc    سرچ روی پروژه‌ها و دسته‌بندی‌ها
// @route   GET /api/search?q=...
// @access  Public
// ─────────────────────────────────────────
export const search = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "عبارت جستجو الزامی است",
      });
    }

    const searchRegex = new RegExp(q, "i");

    const matchingCategories = await Category.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { longDescription: searchRegex },
        { "subCategories.name": searchRegex },
        { "subCategories.description": searchRegex },
      ],
    }).select("_id");

    const categoryIds = matchingCategories.map((c) => c._id);

    // سرچ همزمان روی پروژه‌ها و دسته‌بندی‌ها
    const [projects, categories] = await Promise.all([
      // سرچ روی پروژه‌ها
      Project.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { location: searchRegex },
          { catalogTitle: searchRegex },
          { catalogDescription: searchRegex },
          { category: { $in: categoryIds } },
        ],
      })
        .populate("category", "name slug subCategories")
        .select(
          "title description images location yearBuilt category subCategory isOngoing featured",
        )
        .limit(10),

      // سرچ روی دسته‌بندی‌ها
      Category.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { longDescription: searchRegex },
          { "subCategories.name": searchRegex },
          { "subCategories.description": searchRegex },
        ],
      })
        .select("name slug description image subCategories")
        .limit(5),
    ]);

    // هایلایت کردن subCategory های match شده
    const categoriesWithMatchedSubs = categories.map((cat) => {
      const catObj = cat.toObject();
      catObj.matchedSubCategories = catObj.subCategories.filter(
        (sub) =>
          searchRegex.test(sub.name) || searchRegex.test(sub.description),
      );
      return catObj;
    });

    res.status(200).json({
      success: true,
      query: q,
      results: {
        projects: {
          count: projects.length,
          data: projects,
        },
        categories: {
          count: categories.length,
          data: categoriesWithMatchedSubs,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
