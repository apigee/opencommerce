var grant_type = context.getVariable('grant_type');
var scope = context.getVariable('scope');

print('grant_type: ' + grant_type);
print('scope: ' + scope);

var isError = true;

if (scope) {
    var scopes = scope.split(' ');
    for (var i=0; i < scopes.length; i++) {
        if (scopes[i].toLowerCase() === 'orders') {
            isError = false;
            break;
        }
    }
}

if (grant_type && grant_type == 'client_credentials') {
    var user_name = context.getVariable('request.queryparam.user_id');
    if (user_name) {
        context.setVariable('username', user_name);
    }
} else {
    var user_name = context.getVariable('accesstoken.username');
    if (user_name) {
        context.setVariable('username', user_name)
    }
}

if (isError) {
    context.setVariable('scopeError','Invalid Scope');
}