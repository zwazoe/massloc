# Adding Fields
- Case: I want to add options to shelf. 
-- it will pull from all the user's section (shelf) as options.
1. client\src\components\brain\fields.js
2. scroll down to name field. 
3. add a key name "options" and a value called "Section".




### Error Handling:

- not pulling the collection.
1. navigate to client\src\components\common\crud\PageForm.js
2. make sure that all collections are being added. 

- TypeError: Cannot read property 'Category' of undefined
--let db_collections =  collections[values.options] 
-- client/src/components/brain/Panel.js:47

1. console log PageForm props. 
2. read all is not passing throught PageForm. 
3. fixed by assigning read_all on Page to this.props.crudAll.read_items.

- When section is created via shelf. It shows. When it is created via product or other documents, it does not show. When site is refreshed, it does not show. 

1. The item was not being fetched via the server brain. routes\api\things\Brain.js
2. had to create a businessMiddleware attributes. And then rename the searched item based on what is being called. 
3. Snippet:

                    let rename  = {
						Section: 'owner',
						default: 'attributes_owner'
					}

					let attribues_owner = rename[collection] ? rename[collection] : rename.default
					return Collection.find({[attribues_owner]: place._id })

# Item View

Out of Scope:
Work with Firebase context values instead of passing props into rendering components. Such as user and firebase into the Auth and Index component. 


#Locations

## Connection
client\src\components\place\Network.js

method: const { associateBusiness } from '../../../../redux/actions/place/business/businessActions';
action: post('api/business/associate', data)
Route: routes\api\place\business\business.js

#Notes
Read business is not reading the actual business but instead reading the associtions.
Business connections with anything than other businessess will be overwritten due to a new requests. 