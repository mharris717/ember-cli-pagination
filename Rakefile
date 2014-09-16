require 'mharris_ext'
require 'github/markup'
require 'redcarpet'

class BuildJs
  def build_one(relative_path)
    ec "coffee -c -b #{relative_path}"
  end

  def build_old
    %w(route-mixin controller-mixin test-helpers).each do |f|
      build_one "addon/#{f}.coffee"
    end
  end

  def build
    ec "coffee -b -c -o addon addon-coffee"
  end
end

namespace :build_js do
  task :once do
    BuildJs.new.build
  end

  task :loop do
    loop do
      BuildJs.new.build
      sleep 1
    end
  end
end

task :readme do
  loop do
    
    res = GitHub::Markup.render('README.md', File.read("README.md"))
    File.create "README.html",res
    sleep 0.5
  end
end