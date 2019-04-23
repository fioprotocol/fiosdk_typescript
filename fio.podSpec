require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|

  s.name           = 'Fio'
  s.version        = package['version'].gsub(/v|-beta/, '')
  s.summary        = package['description']
  s.author         = package['author']
  s.license        = package['license']
  s.homepage       = package['homepage']
  s.source         = { :git => 'https://github.com/dapixio/fiosdk_typescript.git', :tag => "v#{s.version}"}
  s.platform       = :ios, "7.0"
  s.preserve_paths = '*.js'

  s.source_files = "react-native-fio/ios/**/*.{h,m,swift}"
  s.dependency "React"
end
