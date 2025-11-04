export function groupCategoriesWithSubcategories(rawResults: any) {
    const categoriesMap = new Map();

    for (const row of rawResults) {
        const category = row.categories;
        const subcategory = row.subcategories;

        if (!categoriesMap.has(category.id)) {
            categoriesMap.set(category.id, {
                ...category,
                subcategories: []
            });
        }

        if (subcategory && subcategory.id) {
            categoriesMap.get(category.id).subcategories.push({ ...subcategory });
        }
    }

    return Array.from(categoriesMap.values());
}