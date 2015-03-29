from fabric.api import local, env, cd, run, settings
from os import path

env.shell = "/bin/bash -l -i -c"

def deploy(reload='yes', dest='~/', NODE_ENV="production", DEBUG='*', name='webs.coffee'):
    app_root = path.join(dest, name)
    local(
        "rsync -rv --delete --copy-links --exclude '.git' --exclude '*.DS_Store' --exclude '*.un~' ./ {}@{}:{}".format(
            env.user, env.hosts[0], app_root,
        )
    )
    with cd(app_root):
        if reload == 'yes':
            with settings(warn_only=True):
                run('pm2 delete ' + name)
            run('DEBUG={} NODE_ENV={} pm2 start bin/www -n {}'.format(DEBUG, NODE_ENV, name))
        else:
            run('pm2 gracefulReload ' + name)
