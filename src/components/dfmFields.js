const jsonsList = {
    "addDistrict": {
        fields: [
          
            {
                "type": "select",
                "key": "state",
                "label": "రాష్ట్రం",
                bindLabel:"teluguLabel",
                fullObject:true,
                "hideSelectKey":true,
                "required": true,
                "options": [ ],
                emitInstantChange:true,
                "onChangeMakeValuesEmpty": ['district', 'town']

            },
            {
                "type": "select",
                "key": "district",
                "label": "జిల్లా",
                "bindLabel":"regionalLanguage",
                "hideSelectKey":true,
                fullObject:true,
                "required": true,
                "options": [ ],
                emitInstantChange:true,
                "onChangeMakeValuesEmpty": ['town']
            },
            {
                "type": "select",
                "key": "town",
                "label": "మండలం / పట్టణం",
                bindLabel:'regionalLanguage',
                bindValue:'label',                fullObject:true,

                "hideSelectKey":true,
                "required": true,
                "options": [ ],
                // emitInstantChange:true
            },
           
        ],
        bottomActions: [

            {
                type: 'submit',
                label: "Save and Proceed",
                action: 'submit',
                icon: '',
                buttonType: 'primary'
            }

        ],
        bottomConfigurations: {
            marginBottom: 155
        }
    },
 
}

export function getJSONData(dataKey) {
    if (jsonsList.hasOwnProperty(dataKey)) {
        return jsonsList[dataKey];
    }
    return null;
}