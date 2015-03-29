from fabric.api import local, env, cd, run
from os import path

def deploy(initial='no', dest='~/', root_url='http://webs.coffee', port='3002', mongo_port='27017', name='webs.coffee'):
    local(
        "rsync -rv --delete --copy-links --exclude '.git' --exclude '*.DS_Store' --exclude '*.un~' ./ {}@{}:{}".format(
            env.user, env.hosts[0], path.join(dest, name),
        )
    )
    with cd(dest):
        if initial == 'yes':
            run(
                'DEBUG=* pm2 start bin/www -n {}'.format(name,)
            )
        else:
            run('pm2 gracefulReload ' + name)
