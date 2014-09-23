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
    ec "coffee -b -c -o app app-coffee"
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

TEST_FILES = ["tests/dummy/app/adapters/application", "tests/dummy/app/controllers/todos", "tests/dummy/app/models/todo", "tests/dummy/app/routes/todos", "tests/helpers/pretender-server", "tests/integration/index-test", "tests/integration/pagination-test"]

task :copy_coffee_tests do
  root = File.dirname(__FILE__)
  %w(js hbs json html xml txt css).each do |ext|
    Dir["#{root}/tests-coffee/**/*.#{ext}"].each do |file|
      dir = File.dirname(file)
      base = File.basename(file)

      target_dir = dir.gsub("tests-coffee","tests")
      puts target_dir
      ec "mkdir -p #{target_dir}"
      FileUtils.cp file,"#{target_dir}/#{base}"
    end
  end

  %w(.jshintrc .gitkeep).each do |ext|
    Dir["#{root}/tests-coffee/**/#{ext}"].each do |file|
      dir = File.dirname(file)
      base = File.basename(file)

      target_dir = dir.gsub("tests-coffee","tests")
      puts target_dir
      ec "mkdir -p #{target_dir}"
      FileUtils.cp file,"#{target_dir}/#{base}"
    end
  end

  ec "coffee --no-header -b -c -o tests tests-coffee"
end

task :build_tests do
  #ec "coffee --no-header -b -c -o tests tests"
  TEST_FILES.each_with_index do |f,i|
    if i <= 9999
      if FileTest.exist?("#{f}.coffee")
        ec "coffee --no-header -b -c #{f}.coffee"
        FileUtils.rm "#{f}.coffee"
      end
    else
      if FileTest.exist?("#{f}.js")
        ec "rm #{f}.js"
      end
    end
  end
end

task :print_coffee do
  root = File.dirname(__FILE__)
  res = []
  Dir["tests/**/*.coffee"].map do |f|
    f.gsub(".coffee","")
  end.each { |x| res << x }
  puts res.inspect
end