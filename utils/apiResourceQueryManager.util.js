module.exports = class APIResourceQueryManager {
    constructor(model, getParameters) {
        this.query = model.find();
        this.getParams = getParameters;
    }

    filter() {
        // Removing the non-attribute params from the GET query params
        let filterObject = { ...this.getParams };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(excludedField => delete filterObject[excludedField]);

        // Adding the $ in front of gte, lte, gt, lt params of query object
        let queryString = JSON.stringify(filterObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        filterObject = JSON.parse(queryString);
        // Perform the filtration
        this.query.find(filterObject);
        return this;
    }

    paginate(defaultPage = 1, defaultLimit = 100) {
        const page = +this.getParams.page || defaultPage;
        const limit = +this.getParams.limit || defaultLimit;
        const skip = (page - 1) * limit;
        this.query.skip(skip).limit(limit);
        return this;
    }

    limitFields(defaultCriteria = '-__v') {
        const selectCriteria = this.getParams.fields ? this.getParams.fields.split(',').join(' ') : defaultCriteria;
        this.query.select(selectCriteria);
        return this;
    }

    sort(defaultCriteria = '-createdAt') {
        const sortCriteria = this.getParams.sort ? this.getParams.sort.split(',').join(' ') : defaultCriteria;
        this.query.sort(sortCriteria);
        return this;
    }
}