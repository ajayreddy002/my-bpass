
export const plotPlanData = [
    {
        id: 1, 
        name: 'Approved Layout Plan', 
        child:[
            {type: 'inputbox', label: 'Layout Number', fieldname: 'layoutNumber'},
            {type: 'file', label: 'Upload Document', fieldname: 'layoutDocs'}
        ]
    },
    {
        id: 2, 
        name: 'Approved Building Plan', 
        child:[
            {type: 'inputbox', label: 'Building Number', fieldname: 'buildingNumber'},
            {type: 'file', label: 'Upload Document', fieldname: 'buildingDocs'}
        ]
    },
    {
        id: 3, 
        name: 'LRS Approved Plan', 
        child:[
            {type: 'inputbox', label: 'LRS Number', fieldname: 'lrsNumber'},
            {type: 'file', label: 'Upload Document', fieldname: 'lrsDocs'}
        ]
    },
    {
        id: 4, 
        name: 'Construction Prior to 1-1-1985', 
        child:[
            {type: 'file', label: 'Upload Document', fieldname: 'registerDocs'}
        ]
    },
    {
        id: 5, 
        name: 'Gramakantam/Abadi NOC Provided from MRO', 
        child:[
            {type: 'file', label: 'Upload Gramakanta Document', fieldname: 'nocDocs'}
        ]
    },
    {
        id: 6, 
        name: 'BPS', 
        child:[
            {type: 'inputbox', label: '1000 String Limit', fieldname: 'layoutNumber'},
            {type: 'file', label: 'Upload Document', fieldname: 'layoutFile'}
        ]
    },
    {
        id: 7, 
        name: 'Unapproved Layout Plan', 
    },
    {
        id: 8, 
        name: 'Others',
    }
  ]